const {expect} = require('chai')
const db = require("../../db")
const getPost = require("./get-post")
const {fixtures} = require('../../../test/utils')


describe('Get POST ', () => {

	let user

	before(async ()=>{
		user = await fixtures.insertUser() 
	})

	describe('Gif', () => {
		
		let post

		before(async ()=>{
			post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			await fixtures.insertPostComment({
				id : post.id,
				userId : user.id,
				type: 'gif'

			})
		})

		it('should throw an error if Gif does not exist', async () => 
		
			expect(getPost({
				id: 1234,
				type: 'gif'}))
				.to.be.rejectedWith('Gif does not exist')
		)


		it('should return a gif', async () => {

			const insertedPost = await getPost({ 
				id: post.id,
				type : 'gif'
		 })
		 	
			const result = await db.query(
				`SELECT p.*, jsonb_agg(c.* ORDER BY c."createdAt" DESC) 
				as comments FROM posts p 
				LEFT JOIN comments c ON p.id = c."postId"
				WHERE p.id=$1 AND p.type =$2
				GROUP BY p.id;`,[ post.id, post.type])
			const expectedPost = result.rows[0]
			const {comments} = expectedPost
			const comment = comments[0]
			
			expect(insertedPost).to.eql({
				id : expectedPost.id,
				userId : expectedPost.userId,
				title : expectedPost.title,
				image : expectedPost.image,
				content : expectedPost.content,
				published : expectedPost.published,
				createdAt : expectedPost.createdAt,
				type: expectedPost.type,
				comments : [
					{
						id: comment.id,
						postId: comment.postId,
						userId: comment.userId,
						content: comment.content,
						createdAt: comment.createdAt,
						published: comment.published
					}
				]
			})	 
		})
		

	})

	describe('Article', () => {
		
		let post
		before(async ()=>{
			post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			await fixtures.insertPostComment({
				id : post.id,
				userId : user.id,
				type: 'article'

			})
		})

		it('should throw an error if Article does not exist', async () => 
		
			expect(getPost({
				id: 1234,
				type: 'article'}))
				.to.be.rejectedWith('Article does not exist')
		)


		it('should return an article', async () => {

			const insertedPost = await getPost({ 
				id: post.id,
				type : 'article'
		 })
		
			const result = await db.query(
				`SELECT p.*, jsonb_agg(c.* ORDER BY c."createdAt" DESC) 
				as comments FROM posts p 
				LEFT JOIN comments c ON p.id = c."postId"
				WHERE p.id=$1 AND p.type =$2
				GROUP BY p.id;`,[ post.id, post.type])
			const expectedPost = result.rows[0]
			const {comments} = expectedPost
			const comment = comments[0]
			expect(insertedPost).to.eql({
				id : expectedPost.id,
				userId : expectedPost.userId,
				title : expectedPost.title,
				image : expectedPost.image,
				content : expectedPost.content,
				published : expectedPost.published,
				createdAt : expectedPost.createdAt,
				type: expectedPost.type,
				comments : [
					{
						id: comment.id,
						postId: comment.postId,
						userId: comment.userId,
						content: comment.content,
						createdAt: comment.createdAt,
						published: comment.published
					}
				]
			})	 
		})
		

	})
	
})