const { faker } = require('@faker-js/faker')
const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')
const { logger }  = require('../../lib')

const log = logger()


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
					title : faker.random.word(5),
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
		beforeEach(async ()=>{
			data = {
				title : faker.random.word(5),
				image : faker.image.imageUrl(),
				article : faker.random.words(),
				likesCount : faker.datatype.number(),
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
		it('should return the right response', async () =>{
			log.info('create new article with this data: ', data)
			fixtures.api()
				.post(`/api/v1/articles`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
				.then((res) => {
					expect(res.body.data.articleId).to.be.an('number')
					expect(res.body.data.createdOn).to.be.a('string')
					delete res.body.data.articleId
					delete res.body.data.createdOn
					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  message: 'Article successfully posted',
							  userId: user.id,
							  title: data.title,
							  image: data.image,
							  likesCount: data.likesCount,
							  article: data.article,
							  published: data.published
							}
						  
						})
				})}
		)
	})

})
