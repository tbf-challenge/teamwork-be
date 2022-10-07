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
   
	})
	
})