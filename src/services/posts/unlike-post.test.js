const {expect} = require('chai')
const db = require("../../db")
const likePost = require("./like-post")
const unlikePost = require("./unlike-post")
const {fixtures} = require('../../../test/utils')


describe('UNLIKE a gif', () => {
	let user
	let post
	before(async ()=>{
		 user = await fixtures.insertUser() 
		post = await fixtures.insertPost({
			userId : user.id , 
			type : 'gif'
		})
	})
	
	it('should delete like in the database', async () => {
		 await fixtures.insertPost({
			userId : user.id , 
			type : 'gif'
		})
		    await likePost({ 
			userId: user.id, 
			postId: post.id
		 })
		await unlikePost({userId : user.id , postId : post.id})
		const result = await db.query(
			`SELECT * FROM post_likes
             WHERE "userId" = $1
             AND "postId" = $2`,[ user.id, post.id ])
		expect(result.rowCount).to.eql(0)	 
	})

})