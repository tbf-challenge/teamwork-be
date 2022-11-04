const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const { fixtures } = require('../../../test/utils')

describe('DELETE /tags/tagId', () => {

	let user
	let accessToken
	let tag
	let updatedInfo

	before(async ()=> {
        
		user = await fixtures.insertUser() 
		const body = { id: user.id, email: user.email }
		accessToken = fixtures.generateAccessToken(
			{user : body}
		)
		tag = await fixtures.insertTag() 
		updatedInfo = {
			tagId : tag.id,
			title : faker.random.word(5),
			content: faker.random.words()
		}

	})

	describe('Failure', () => {
	
		it('should return 401 if request is not authenticated', async () => 
			fixtures.api()
				.patch(`/api/v1/tags/${tag.id}`)
				.expect(401)
		)

		it('should return 400 if tagId is not a number', async () => {
			const expectedError = {
				"error": {
					"message": "tagId must be a number"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/tags/sdsdsd`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(updatedInfo)
				.expect(400, expectedError)

		})
        
		it('should return 400 if title is not a string', async () => {
			const expectedError = {
				"error": {
					"message": "title must be a string"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/tags/${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : 123,
					content : updatedInfo.content
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
				.patch(`/api/v1/tags/${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : updatedInfo.title,
					content : 123
				})
				.expect(400, expectedError)
		})
		
		it('should return 404 if tag is not found', async () => 
			
			fixtures.api()
				.patch(`/api/v1/tags/${tag.id + 2}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					title : updatedInfo.title,
					content : updatedInfo.content
					 })
				.expect(404)
				.then((res) => {
					expect(res.body.status).eql('fail')
					expect(res.body.message).eql('Tag does not exist')
				})
		)

	})

	describe('Success', () => {

		it('should return 200 if tag is updated', async () => 
			fixtures.api()
				.patch(`/api/v1/tags/${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : updatedInfo.title,
					content : updatedInfo.content
				})
				.expect(200)

		)

		it('should return the right response', async () =>
			fixtures.api()
				.patch(`/api/v1/tags/${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : updatedInfo.title,
					content : updatedInfo.content
				})
				.expect(200)
				.then((res) => {
					
					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  id : updatedInfo.tagId,
							  title: updatedInfo.title,
							  content: updatedInfo.content
							}
						  
						}
					)
				})
		)

	})
})