const {expect} = require('chai')
const db = require("../../db")
const likePost = require("./like-post")
const unlikePost = require("./unlike-post")
const {fixtures} = require('../../../test/utils')


describe('UNLIKE a post', () => {
	let user
	
	before(async ()=>{
		user = await fixtures.insertUser() 
	})
	describe('GIF', () => {
		let post
		before(async ()=>{
			post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
		})
		it('should delete a gif like in the database', async () => {
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
	
	describe('ARTICLE', () => {
		let post
		before(async ()=>{
			post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
		})
		it('should delete an article like in the database', async () => {
			await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
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
	
})