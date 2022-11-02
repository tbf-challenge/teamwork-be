const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')


describe('GET /Articles/:article.id', () => {
    
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

		it('should return 400 if article.id is invalid', async () => {
			const expectedError = {
				"status" : "failed",
				"error": {
			  "message": "id must be a number"
				}
		  }
			return	fixtures.api()
				.get(`/api/v1/articles/sdsdsd`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(400, expectedError)

		})
		
	})

	describe('Success', () => {

		let article

		before(async ()=>{
			article = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
		})

		it('should return 200', async () => 

			fixtures.api()
				.get(`/api/v1/articles/${article.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
		)

		it('should return the right response', async () =>

			fixtures.api()
				.get(`/api/v1/articles/${article.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
				.then((res) => {
				
					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  userId: user.id,
							  title: article.title,
							  image: article.image,
							  article: article.content,
							  published: article.published,
								createdOn: article.createdAt.toISOString(),
								articleId : article.id,
								comments: []
							}
						  
						})
				})
		)
	})

})
