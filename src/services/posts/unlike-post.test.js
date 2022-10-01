const {expect} = require('chai')
const db = require("../../db")
const likePost = require("./like-post")
const unlikePost = require("./unlike-post")
const {fixtures} = require('../../../test/utils')


describe('UNLIKE a post', () => {
	let user
	let gif
	let article
	before(async ()=>{
		user = await fixtures.insertUser() 
		gif = await fixtures.insertPost({
			userId : user.id , 
			type : 'gif'
		})
		article = await fixtures.insertPost({
			userId : user.id , 
			type : 'article'
		})
	})
	
	it('should delete a gif like in the database', async () => {
		 await fixtures.insertPost({
			userId : user.id , 
			type : 'gif'
		})
		    await likePost({ 
			userId: user.id, 
			postId: gif.id
		 })
		await unlikePost({userId : user.id , postId : gif.id})
		const result = await db.query(
			`SELECT * FROM post_likes
             WHERE "userId" = $1
             AND "postId" = $2`,[ user.id, gif.id ])
		expect(result.rowCount).to.eql(0)	 
	})

	it('should delete an article like in the database', async () => {
		await fixtures.insertPost({
			userId : user.id , 
			type : 'article'
		})
		    await likePost({ 
			userId: user.id, 
			postId: article.id
		 })
		await unlikePost({userId : user.id , postId : article.id})
		const result = await db.query(
			`SELECT * FROM post_likes
			 WHERE "userId" = $1
			 AND "postId" = $2`,[ user.id, article.id ])
		expect(result.rowCount).to.eql(0)	 
	})
})