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
			const flaggedPost = await flagPost({ 
				userId: user.id, 
				postId: newPost.id,
				reason
		 })
			const result = await db.query(
				`SELECT * FROM post_flags
             WHERE "userId" = $1
             AND "postId" = $2`,[ user.id, newPost.id ])
			expect(flaggedPost).to.eql(result.rows[0])	 
		})
		

	})
	
})