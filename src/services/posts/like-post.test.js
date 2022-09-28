const {expect} = require('chai')
const db = require("../../db")
const likePost = require("./like-post")
const {fixtures} = require('../../../test/utils')


describe('RECORD LIKES ', () => {
	let user
	before(async ()=>{
		user = await fixtures.insertUser() 
	})
	describe('Gif', () => {
		
		let post
		before(async ()=>{
			user = await fixtures.insertUser() 
			post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
		})
		it('should throw an error if Gif is already liked', async () => {
			await fixtures.insertPostLike({
				userId : user.id,
				postId: post.id,
				type: 'gif'
			})
			return expect(likePost({
				userId: user.id, 
				postId: post.id,
				type: 'gif'}))
				.to.be.rejectedWith('Gif has already been liked')

		})


		it('should record likes on a gif', async () => {
			const newPost = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			const likedPost = await likePost({ 
				userId: user.id, 
				postId: newPost.id
		 })
			const result = await db.query(
				`SELECT * FROM post_likes
             WHERE "userId" = $1
             AND "postId" = $2`,[ user.id, newPost.id ])
			expect(likedPost).to.eql(result.rows[0])	 
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
		it('should throw an error if Article is already liked', async () => {
			await fixtures.insertPostLike({
				userId : user.id,
				postId: post.id,
				type: 'article'
			})
			return expect(likePost({
				userId: user.id, 
				postId: post.id,
				type : 'article'}))
				.to.be.rejectedWith('Article has already been liked')

		})


		it('should record likes on a article', async () => {
			const newPost = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			const likedPost = await likePost({ 
				userId: user.id, 
				postId: newPost.id
		 })
			const result = await db.query(
				`SELECT * FROM post_likes
             WHERE "userId" = $1
             AND "postId" = $2`,[ user.id, newPost.id ])
			expect(likedPost).to.eql(result.rows[0])	 
		})

	})

})