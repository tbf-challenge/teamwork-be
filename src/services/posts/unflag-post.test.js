const {expect} = require('chai')
const db = require("../../db")
const unflagPost = require("./unflag-post")
const {fixtures} = require('../../../test/utils')


describe('UNFLAG a post', () => {
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
		it('should delete a gif flag in the database', async () => {
			await fixtures.insertPost({
			   userId : user.id , 
			   type : 'gif'
		   })
			
			await fixtures.insertPostFlag({
				userId : user.id ,
				postId : post.id
			})
		   await unflagPost({userId : user.id , postId : post.id})
		   const result = await db.query(
			   `SELECT * FROM post_flags
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

		it('should delete an article flag in the database', async () => {
			await fixtures.insertPost({
			   userId : user.id , 
			   type : 'article'
		   })
			
			await fixtures.insertPostFlag({
				userId : user.id ,
				postId : post.id
			})
		   await unflagPost({userId : user.id , postId : post.id})
		   const result = await db.query(
			   `SELECT * FROM post_flags
				WHERE "userId" = $1
				AND "postId" = $2`,[ user.id, post.id ])
		   expect(result.rowCount).to.eql(0)	 
	   })
   

	   it('should decrement flagsCount on post', async () => {
			const newPost = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			await unflagPost({ 
				userId: user.id, 
				postId: newPost.id
	 })
			const result = await db.query(
				`SELECT "flagsCount" FROM posts
		 WHERE id = $1`,[ newPost.id ])

			const {flagsCount} = result.rows[0]

			const postFlagsCountQueryResult = await db.query(
				`SELECT COUNT(*) FROM post_flags
		 WHERE "postId" = $1`,[ newPost.id ])
		 
			const postFlagCount = Number(
				postFlagsCountQueryResult.rows[0].count)
		
			expect(postFlagCount).to.eql(flagsCount)	 
		})
	})
})
