const { faker } = require('@faker-js/faker')
const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')


describe('POST /gifs', () => {
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
				.post(`/api/v1/gifs`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					title : "",
					image: faker.image.imageUrl(),
					published : faker.datatype.boolean()
				})
				.expect(400, expectedError)

		})
		it('should return 400 if imageUrl is invalid', async () => {
			const expectedError = {
				"status" : "failed",
				"error": {
			  "message": "image is not allowed to be empty"
				}
		  }
			return	fixtures.api()
				.post(`/api/v1/gifs`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					title : faker.random.word(5),
					image: "",
					published : faker.datatype.boolean()
				})
				.expect(400, expectedError)

		})

		it('should return 401 if request is not authenticated', async () => 
			fixtures.api()
				.post(`/api/v1/gifs`)
			    .expect(401))


	})

	describe('Success', () => {
		let data
		before(async ()=>{
			data = {
				title : faker.random.word(5),
				image : faker.image.imageUrl(),
				published: faker.datatype.boolean()
			}
		})
		it('should return 201', async () => 
			fixtures.api()
				.post(`/api/v1/gifs`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
		)
		it('should return the right response', async () =>
			fixtures.api()
				.post(`/api/v1/gifs`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
				.then((res) => {
					expect(res.body.data.gifId).to.be.an('number')
					expect(res.body.data.createdOn).to.be.a('string')
					delete res.body.data.gifId
					delete res.body.data.createdOn
					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  message: 'GIF image successfully posted',
							  userId: user.id,
							  title: data.title,
							  imageUrl: data.image,
							  published: data.published
							}
						  
						})
				})
		)
	})

})
