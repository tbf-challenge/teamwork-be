const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const { fixtures } = require('../../../test/utils')

describe('POST /tags', () => {

	let user
	let accessToken

	before(async ()=> {

		user = await fixtures.insertUser() 
		const body = { id: user.id, email: user.email }
		accessToken = fixtures.generateAccessToken(
			{user : body}
		)

	})

	describe('Failure', () => {

		let tag
		before(async ()=>{
			tag = {
				title : faker.random.word(5),
				content : faker.random.words()
			}
		})
	
		it('should return 401 if request is not authenticated', async () => 
			fixtures.api()
				.post(`/api/v1/tags`)
				.expect(401)
		)
        
		it('should return 400 if title is not a string', async () => {
			const expectedError = {
				"error": {
					"message": "title must be a string"
				},
				"status": "failed"
			}
			return fixtures.api()
				.post(`/api/v1/tags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : 123,
					content : tag.content
				})
				.expect(400, expectedError)
		})

		it('should return 400 if content is not a string', async () => {
			const expectedError = {
				"error": {
					"message": "content must be a string"
				},
				"status": "failed"
			}
			return fixtures.api()
				.post(`/api/v1/tags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : tag.title,
					content : 123
				})
				.expect(400, expectedError)
		})
		
		it('should return 400 if title field is empty', async () => {

			const expectedError = {
				"error": {
					"message": "title is not allowed to be empty"
				},
				"status": "failed"
			}
			
			fixtures.api()
				.post(`/api/v1/tags/`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					title : "",
					content : tag.content
					 })
				.expect(400, expectedError)
		})

	})

	describe('Success', () => {

		let tag
		beforeEach(async ()=>{
			tag = {
				title : faker.random.word(5),
				content : faker.random.words()
			}
		})

		it('should return 201 if tag is created', async () => 

			fixtures.api()
				.post(`/api/v1/tags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : tag.title,
					content : tag.content
				})
				.expect(201)

		)

		it('should return the right response', async () =>
			
			fixtures.api()
				.post(`/api/v1/tags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(tag)
				.expect(201)
				.then((res) => {

					expect(res.body.data.id).to.be.an('number')
					delete res.body.data.id
					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  title: tag.title,
							  content: tag.content
							}
						  
						}
					)
				})
		)

	})
})