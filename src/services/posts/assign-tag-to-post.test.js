const { expect } = require('chai')
const db = require("../../db")
const assignTagToPost = require("./assign-tag-to-post")
const { fixtures } = require('../../../test/utils')


describe('ASSIGN TAG TO POST ', () => {
	let user
	
	before(async () => {
		user = await fixtures.insertUser() 
		
	})
	describe('Gif', () => {
		
		let post
		let tag

		before(async () => {
			post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			tag = await fixtures.insertTag()  
		})

		it('should throw an error if tag is already assigned', async () => {
			await fixtures.insertPostTag({
				postId: post.id,
				tagId: tag.id,
				type: 'gif'
			})
			return expect( assignTagToPost({
				postId: post.id,
				tagId: tag.id
			}))
				.to.be.rejectedWith('Tag is already assigned to post')

		})


		it('should assign tag to a post', async () => {
			const newPost = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			const postTags = await assignTagToPost({ 
				postId: newPost.id,
				tagId: tag.id
		 })
			const result = await db.query(
				`SELECT * FROM posts_tags 
                WHERE "postId" = $1 
                AND "tagId" = $2`,[ newPost.id, tag.id ])
			const expectedPostTags = result.rows[0]
	
			expect(postTags).to.eql({
				postId : expectedPostTags.postId,
				tagId : expectedPostTags.tagId
			})	 
		})
		

	})

	describe('Article', () => {
		
		let post
		let tag

		before(async () => {

			post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})

			tag = await fixtures.insertTag()  
		})

		it('should throw an error if tag is already assigned', async () => {

			await fixtures.insertPostTag({
				postId: post.id,
				tagId: tag.id,
				type: 'article'
			})
			return expect( assignTagToPost({
				postId: post.id,
				tagId: tag.id
			}))
				.to.be.rejectedWith('Tag is already assigned to post')

		})


		it('should assign tag to a post', async () => {
			const newPost = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			const postTags = await assignTagToPost({ 
				postId: newPost.id,
				tagId: tag.id
		 })
			const result = await db.query(
				`SELECT * FROM posts_tags 
                WHERE "postId" = $1 
                AND "tagId" = $2`,[ newPost.id, tag.id ])
			const expectedPostTags = result.rows[0]
	
			expect(postTags).to.eql({
				postId : expectedPostTags.postId,
				tagId : expectedPostTags.tagId
			})	 
		})
		
	})
})