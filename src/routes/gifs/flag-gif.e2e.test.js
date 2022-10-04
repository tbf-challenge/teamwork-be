const { faker } = require('@faker-js/faker')
const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')


describe('POST /gifs/:id/flags', () => {
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
				.post(`/api/v1/gifs/sdsdsd/flags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(400, expectedError)

		})

		it('should return 401 if request is not authenticated', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			}) 
			return fixtures.api()
				.post(`/api/v1/gifs/${post.id}/flags`)
				.expect(401)

		})
		it('should throw an error if Gif is already flagged', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			}) 
			await fixtures.insertPostFlag({
				userId : user.id,
				postId: post.id,
				type: 'gif',
				reason: data.reason
			})
		
			return fixtures.api()
				.post(`/api/v1/gifs/${post.id}/flags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(422)
				.then(res => {
					expect(res.body.status).eql('fail')
					expect(res.body.error.message)
						.eql(`Gif has already been flagged`)
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
				type : 'gif'
			})
			return fixtures.api()
				.post(`/api/v1/gifs/${post.id}/flags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
			
		})
		it('should return the right response', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			
			return fixtures.api()
				.post(`/api/v1/gifs/${post.id}/flags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
				.then(res => {
					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  message: 'GIF image successfully flagged',
							  userId: user.id,
							  gifId: post.id,
							  reason: data.reason
							}
						  }
					)
				})
			
		})
	})


})
