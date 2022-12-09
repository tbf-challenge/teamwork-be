const { expect } = require('chai')
const { fixtures } = require('../../../test/utils')


describe('DELETE /articles/:articleId/tags/:tagId', () => {

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
		
		it('should return 400 if articleId is not a number', async () => {
			const tag = await fixtures.insertTag() 

			const expectedError = {
				"error": {
			  "message": "articleId must be a number"
				},
		   "status": "failed"
		  }
			return	fixtures.api()
				.delete(`/api/v1/articles/sdsdsd/tags/${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(400, expectedError)

		})

		it('should return 400 if tagId is not a number', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})

			const expectedError = {
				"error": {
			  "message": "tagId must be a number"
				},
		   "status": "failed"
		  }
			return	fixtures.api()
				.delete(`/api/v1/articles/${post.id}/tags/sdsdsd`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(400, expectedError)

		})

		it('should return 401 if request is not authenticated', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			}) 
			const tag = await fixtures.insertTag() 
			return fixtures.api()
				.delete(`/api/v1/articles/${post.id}/tags/${tag.id}`)
				.expect(401)

		})
        

	})

	describe('Success', () => {

		it('should return status code 200 when request succeeds', async () => {

			const tag = await fixtures.insertTag() 
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			return fixtures.api()
				.delete(`/api/v1/articles/${post.id}/tags/${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
			
		})

		it('should return the right response', async () => {
			const tag = await fixtures.insertTag() 
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			
			return fixtures.api()
				.delete(`/api/v1/articles/${post.id}/tags/${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
				.then(res => {

					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  message : "Tag has been removed from post"
							}
						  }
					)
				})
			
		})
	})


})
