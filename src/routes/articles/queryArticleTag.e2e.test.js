const { expect } = require('chai')
const { fixtures, resetDBTable } = require('../../../test/utils')


describe('GET /articles/query', () => {
    
	let user
	let accessToken

	before(async ()=>{
		 user = await fixtures.insertUser() 
		const accessTokenParams = { id: user.id, email: user.email }
		accessToken = fixtures.generateAccessToken(
			{user : accessTokenParams}
		)
	})

	describe('Failure', () => {

		it('should return 400 if tag is invalid', async () => {
			const expectedError = {
				"status" : "failed",
				"error": {
			  "message": "tag must be a number"
				}
		  }
			return	fixtures.api()
				.get(`/api/v1/articles/query/?tag=${'sdsdsd'}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(400, expectedError)

		})

	})

	describe('Success', () => {

		it('should return 200 is request is successful', async () => {
			await resetDBTable('tags')
			const tag = await fixtures.insertTag()  
    
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			await fixtures.insertPostTag({
				postId: post.id,
				tagId: tag.id
			})
			return fixtures.api()
				.get(`/api/v1/articles/query/?tag=${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
		})

		it('should return the right response', async () => {
			await resetDBTable('tags')
			const tag = await fixtures.insertTag()  
    
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			const postTag = await fixtures.insertPostTag({
				postId: post.id,
				tagId: tag.id
			})
			return fixtures.api()
				.get(`/api/v1/articles/query/?tag=${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
				.then((res) => {

					expect(res.body).to.eql(

						{
							status: 'success',
							data: [{
							  userId: post.userId,
							  title: post.title,
							  image: post.image,
							  article: post.content,
							  published: post.published,
								createdOn: post.createdAt.toISOString(),
								articleId : postTag.postId,
								tagId: postTag.tagId
								
							}]
						  
						})
				})
		})
	})
})