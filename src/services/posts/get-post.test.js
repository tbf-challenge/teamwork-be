const {expect} = require('chai')
const getPost = require("./get-post")
const {fixtures} = require('../../../test/utils')


describe('Get POST ', () => {

	let user

	before(async ()=>{
		user = await fixtures.insertUser() 
	})

	describe('Gif', () => {
		
		let post
		let comment

		before(async ()=>{
			post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			comment = await fixtures.insertPostComment({
				id : post.id,
				userId : post.userId

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
		 	
			const {comments} = insertedPost

			expect(comments[0].createdAt).to.be.a('string')
			delete comments[0].createdAt
			
			
			expect(insertedPost).to.eql({
				id : post.id,
				userId : post.userId,
				title : post.title,
				image : post.image,
				content : post.content,
				published : post.published,
				createdAt : post.createdAt,
				type: post.type,
				comments : [
					{
						id: comment.id,
						postId: comment.postId,
						userId: comment.userId,
						content: comment.content,
						published: comment.published
					}
				]
			})	 
		})
		

	})

	describe('Article', () => {
		
		let post
		let comment
		before(async ()=>{
			post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			comment = await fixtures.insertPostComment({
				id : post.id,
				userId : user.id

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
		 	
			 const {comments} = insertedPost

			 expect(comments[0].createdAt).to.be.a('string')
			 delete comments[0].createdAt
			
			expect(insertedPost).to.eql({
				id : post.id,
				userId : post.userId,
				title : post.title,
				image : post.image,
				content : post.content,
				published : post.published,
				createdAt : post.createdAt,
				type: post.type,
				comments : [
					{
						id: comment.id,
						postId: comment.postId,
						userId: comment.userId,
						content: comment.content,
						published: comment.published
					}
				]
			})	 
		})
		

	})
	
})