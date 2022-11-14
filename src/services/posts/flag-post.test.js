const {expect} = require('chai')
const { faker } = require('@faker-js/faker')
const db = require("../../db")
const flagPost = require("./flag-post")
const {fixtures} = require('../../../test/utils')


describe('FLAGGED POSTS ', () => {
	let user
	let reason
	before(async ()=>{
		user = await fixtures.insertUser() 
		reason = faker.random.words()
	})
	describe('Gif', () => {
		
		let post
		before(async ()=>{
			post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
		})
		it('should throw an error if Gif is already flagged', async () => {
			await fixtures.insertPostFlag({
				userId : user.id,
				postId: post.id,
				type: 'gif',
				reason
			})
			return expect(flagPost({
				userId: user.id, 
				postId: post.id,
				reason,
				type: 'gif'}))
				.to.be.rejectedWith('Gif has already been flagged')

		})


		it('should record flags on a gif', async () => {
			const newPost = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			const postFlag = await flagPost({ 
				userId: user.id, 
				postId: newPost.id,
				reason
		 })
			const result = await db.query(
				`SELECT * FROM post_flags
             WHERE "userId" = $1
             AND "postId" = $2`,[ user.id, newPost.id ])
			const expectedFlag = result.rows[0]
			expect(postFlag).to.eql({
				userId : expectedFlag.userId,
				postId : expectedFlag.postId,
				reason : expectedFlag.reason,
				createdAt : expectedFlag.createdAt
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
		it('should throw an error if Article is already flagged', async () => {
			await fixtures.insertPostFlag({
				userId : user.id,
				postId: post.id,
				type: 'article',
				reason
			})
			return expect(flagPost({
				userId: user.id, 
				postId: post.id,
				reason,
				type: 'article'}))
				.to.be.rejectedWith('Article has already been flagged')

		})


		it('should record flags on an article', async () => {
			const newPost = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			const postFlag = await flagPost({ 
				userId: user.id, 
				postId: newPost.id,
				reason
		 })
			const result = await db.query(
				`SELECT * FROM post_flags
             WHERE "userId" = $1
             AND "postId" = $2`,[ user.id, newPost.id ])
			const expectedFlag = result.rows[0]
			expect(postFlag).to.eql({
				userId : expectedFlag.userId,
				postId : expectedFlag.postId,
				reason : expectedFlag.reason,
				createdAt : expectedFlag.createdAt
			})	 
		})
		
		it('should increment flagsCount on post', async () => {
			const newPost = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			await flagPost({ 
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
