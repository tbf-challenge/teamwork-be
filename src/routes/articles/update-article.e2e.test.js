const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const { fixtures } = require('../../../test/utils')

describe('PATCH /articles/:id', () => {
	let user
	let accessToken
	let article
	let updatedInfo = {}
	beforeEach(async ()=> {
		user = await fixtures.insertUser() 
		const body = { id: user.id, email: user.email }
		accessToken = fixtures.generateAccessToken(
			{user : body}
		)
		article = await fixtures.insertPost({
			userId : user.id,
			type : 'article'
		})
		updatedInfo = {
			title : faker.random.word(),
			image : faker.image.imageUrl(),
			content : faker.random.words(),
			published : faker.datatype.boolean()
		}

	})
	describe('Failure', () => {
		it('should return 401 if request is not authenticated', async () => 
			fixtures.api()
				.patch(`/api/v1/articles/${article.id}`)
				.expect(401)
		)
		it('should return 400 if id is not a number', async () => {
			const expectedError = {
				"error": {
					"message": "id must be a number"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/articles/sdsdsd`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(
					{
						title : updatedInfo.title,
						image : updatedInfo.image,
						article : updatedInfo.content,
						published : updatedInfo.published
					})
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
				.patch(`/api/v1/articles/${article.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : 123,
					article : updatedInfo.content
				})
				.expect(400, expectedError)
		})
		it('should return 400 if article is not a string', async () => {
			const expectedError = {
				"error": {
					"message": "article must be a string"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/articles/${article.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : updatedInfo.title,
					image : updatedInfo.image,
					article : 123,
					published : updatedInfo.published
				})
				.expect(400, expectedError)
		})
		it('should return 400 if image is not a valid url',
		 async () => {
				const expectedError = {
					"error": {
						"message": "image must be a string"
					},
					"status": "failed"
				}
				return fixtures.api()
					.patch(`/api/v1/articles/${article.id}`)
					.set('Authorization', `Bearer ${accessToken}`)
					.send({
						title : updatedInfo.title,
						image : 123,
						article : updatedInfo.content,
						published : updatedInfo.published
					})
					.expect(400, expectedError)
			})
		it('should return 400 if published is not a boolean',
			async () => {
				const expectedError = {
					"error": {
						"message": "published must be a boolean"
					},
					"status": "failed"
				}
				return fixtures.api()
					.patch(`/api/v1/articles/${article.id}`)
					.set('Authorization', `Bearer ${accessToken}`)
					.send({
						title : updatedInfo.title,
						image : updatedInfo.image,
						article : updatedInfo.content,
						published : 123
					})
					.expect(400, expectedError)
			})

		it('should return 404 if article is not found', async () => 
			
			fixtures.api()
				.patch(`/api/v1/articles/${article.id + 2}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					title : updatedInfo.title,
					image : updatedInfo.image,
					article : updatedInfo.content,
					published : updatedInfo.published
					 })
				.expect(404)
				.then((res) => {
					expect(res.body.status).eql('fail')
					expect(res.body.message).eql('Article does not exist')
				})
		)

	})
	describe('Success', () => {
		it('should return 200 if article is updated', async () => 
			fixtures.api()
				.patch(`/api/v1/articles/${article.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : updatedInfo.title,
					image : updatedInfo.image,
					article : updatedInfo.content,
					published : updatedInfo.published
				})
				.expect(200)

		)
		it('should return the right response', async () =>
			fixtures.api()
				.patch(`/api/v1/articles/${article.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					title : updatedInfo.title,
					image : updatedInfo.image,
					article : updatedInfo.content,
					published : updatedInfo.published
				})
				.expect(200)
				.then((res) => {
					expect(res.body.data.userId).to.be.an('number')
					expect(res.body.data.articleId).to.be.an('number')
					expect(res.body.data.createdOn).to.be.a('string')
					delete res.body.data.userId
					delete res.body.data.articleId
					delete res.body.data.createdOn
					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  message: 'Article successfully updated',
							  title: updatedInfo.title,
							  image: updatedInfo.image,
							  article: updatedInfo.content,
							  published: updatedInfo.published
							}
						  
						}
					)
				})
		)

	})
})