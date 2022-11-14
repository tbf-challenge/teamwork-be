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

		it('should decrement likesCount on post', async () => {
			const newPost = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			await unlikePost({ 
				userId: user.id, 
				postId: newPost.id
		 })
			const result = await db.query(
				`SELECT "likesCount" FROM posts
             WHERE id = $1`,[ newPost.id ])

			const {likesCount} = result.rows[0]

			const postLikesCountQueryResult = await db.query(
				`SELECT COUNT(*) FROM post_likes
             WHERE "postId" = $1`,[ newPost.id ])
			 
			const postLikeCount = Number(
				postLikesCountQueryResult.rows[0].count)
			
			expect(postLikeCount).to.eql(likesCount)	 
		})
	})
	
})