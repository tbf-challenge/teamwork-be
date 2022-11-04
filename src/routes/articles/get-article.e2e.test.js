const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')


describe('GET /articles/:id', () => {
    
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

		it('should return 400 if article id is invalid', async () => {
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

		it('should return 404 if article does not exist', async () => 
			fixtures.api()
				.get(`/api/v1/articles/${10000}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(404)
				.then(res => {
					expect(res.body.status).to.eql('fail')
					expect(res.body.message).to.eql('Article does not exist')
				})

		)
		
	})

	describe('Success', () => {

		let article
		let comment
		before(async ()=>{
			article = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			comment = await fixtures.insertPostComment({
				id : article.id,
				userId : article.userId

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
							  userId: article.userId,
							  title: article.title,
							  image: article.image,
							  article: article.content,
							  published: article.published,
								createdOn: article.createdAt.toISOString(),
								articleId : article.id,
								comments: [
									{
										comment : comment.content,
										id : comment.id,
										userId : comment.userId
									}
								]
							}
						  
						})
				})
		)
	})

})
