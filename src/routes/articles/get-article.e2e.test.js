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
		let comment
		before(async ()=>{
			article = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			comment = await fixtures.insertPostComment({
				id : article.id,
				userId : user.id,
				type: 'article'

			})
		})

		it('should return 200', async () => 

			fixtures.api()
				.get(`/api/v1/articles/${article.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
		)

		it('should return the right response', async () =>{
			const {post, insertedComment} = comment
			return fixtures.api()
				.get(`/api/v1/articles/${article.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
				.then((res) => {

					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  userId: post.userId,
							  title: post.title,
							  image: post.image,
							  article: post.content,
							  published: post.published,
								createdOn: post.createdAt.toISOString(),
								articleId : post.id,
								comments: [
									{
										comment : insertedComment.content,
										id : insertedComment.id,
										userId : insertedComment.userId
									}
								]
							}
						  
						})
				})
		})
	})

})
