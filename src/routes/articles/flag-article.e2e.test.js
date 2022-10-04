const { faker } = require('@faker-js/faker')
const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')


describe('POST /articles/:id/flags', () => {
	let user
	let accessToken
	before(async ()=>{
		 user = await fixtures.insertUser() 
		const body = { id: user.id, email: user.email }
		accessToken = fixtures.generateAccessToken(
			{user : body}
		)
	})
	describe('Failure', () => {
		
		let data
		before(async ()=>{
			data = {
				userId : user.id,
				reason : faker.random.words()
			}
		})
		it('should return 400 if postId is not a number', async () => {
			const expectedError = {
				"error": {
			  "message": "id must be a number"
				},
		   "status": "failed"
		  }
			return	fixtures.api()
				.post(`/api/v1/articles/sdsdsd/flags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(400, expectedError)

		})

		it('should return 401 if request is not authenticated', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			}) 
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/flags`)
				.expect(401)

		})
		it('should throw an error if Article is already flagged', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			}) 
			await fixtures.insertPostFlag({
				userId : user.id,
				postId: post.id,
				type: 'article',
				reason: data.reason
			})
		
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/flags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(422)
				.then(res => {
					expect(res.body.message)
						.eql(`Article has already been flagged`)
					
				})
		})

	})

	describe('Success', () => {
		let data
		before(async ()=>{
			data = {
				userId : user.id,
				reason : faker.random.words()
			}
		})
		it('should return 201', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/flags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
			
		})
		it('should return the right response', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/flags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
				.then(res => {
					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  message: 'Article successfully flagged',
							  userId: user.id,
							  articleId: post.id,
							  reason: data.reason
							}
						  }
					)
				})
			
		})
	})


})
