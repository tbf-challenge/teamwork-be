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
				`SELECT * FROM posts
             WHERE "id" = $1
             AND "type" = $2`,[ post.id, post.type])
			const expectedPost = result.rows[0]
	
			expect(insertedPost).to.eql({
				id : expectedPost.id,
				userId : expectedPost.userId,
				title : expectedPost.title,
				image : expectedPost.image,
				content : expectedPost.content,
				published : expectedPost.published,
				createdAt : expectedPost.createdAt,
				type: expectedPost.type,
				comments : insertedPost.comments
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
		})

		it('should throw an error if Article does not exist', async () => 
		
			expect(getPost({
				id: 1234,
				type: 'article'}))
				.to.be.rejectedWith('Article does not exist')
		)


		it('should return a article', async () => {

			const insertedPost = await getPost({ 
				id: post.id,
				type : 'article'
		 })
		
			const result = await db.query(
				`SELECT * FROM posts
             WHERE "id" = $1
             AND "type" = $2`,[ post.id, post.type])
			const expectedPost = result.rows[0]
	
			expect(insertedPost).to.eql({
				id : expectedPost.id,
				userId : expectedPost.userId,
				title : expectedPost.title,
				image : expectedPost.image,
				content : expectedPost.content,
				published : expectedPost.published,
				createdAt : expectedPost.createdAt,
				type: expectedPost.type,
				comments : insertedPost.comments
			})	 
		})
		

	})
	
})