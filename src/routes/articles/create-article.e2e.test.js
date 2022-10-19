const { faker } = require('@faker-js/faker')
const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')


describe('POST /articles', () => {
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
		it('should return 400 if id is not a number', async () => {
			const expectedError = {
				"status" : "failed",
				"error": {
			  "message": "userId must be a number"
				}
		  }
			return	fixtures.api()
				.post(`/api/v1/articles`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					userId : "userId",
					title : faker.random.word(),
					article: faker.random.words(),
					published : faker.datatype.boolean(),
					type : 'article'
				})
				.expect(400, expectedError)

		})
		it('should return 400 if title is invalid', async () => {
			const expectedError = {
				"status" : "failed",
				"error": {
			  "message": "title is not allowed to be empty"
				}
		  }
			return	fixtures.api()
				.post(`/api/v1/articles`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					userId : user.id,
					title : "",
					article: faker.random.words(),
					published : faker.datatype.boolean(),
					type : 'article'
				})
				.expect(400, expectedError)

		})
		it('should return 400 if article is invalid', async () => {
			const expectedError = {
				"status" : "failed",
				"error": {
			  "message": "article is not allowed to be empty"
				}
		  }
			return	fixtures.api()
				.post(`/api/v1/articles`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					userId : user.id,
					title : faker.random.word(),
					article: "",
					published : faker.datatype.boolean(),
					type : 'article'
				})
				.expect(400, expectedError)

		})
		it('should return 401 if request is not authenticated', async () => 
			fixtures.api()
				.post(`/api/v1/articles`)
			    .expect(401))


	})

	describe('Success', () => {
		let data
		before(async ()=>{
			data = {
				userId : user.id,
				title : faker.random.word(),
				image : faker.image.imageUrl(),
				article : faker.random.words(),
				published : faker.datatype.boolean(),
				type : 'article'
			}
		})
		it('should return 201', async () => 
			fixtures.api()
				.post(`/api/v1/articles`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
		)
		it('should return the right response', async () =>
			fixtures.api()
				.post(`/api/v1/articles`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
				.then((res) => {
					delete res.body.data.articleId
					delete res.body.data.createdOn
					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  message: 'Article successfully posted',
							  userId: data.userId,
							  title: data.title,
							  image: data.image,
							  article: data.article,
							  published: data.published
							}
						  
						})
				})
		)
	})

})
