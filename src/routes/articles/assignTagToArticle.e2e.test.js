const { expect } = require('chai')
const { fixtures } = require('../../../test/utils')


describe('POST /articles/:id/tags', () => {

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
		
		it('should return 400 if postId is not a number', async () => {
			const tag = await fixtures.insertTag() 

			const expectedError = {
				"error": {
			  "message": "articleId must be a number"
				},
		   "status": "failed"
		  }
			return	fixtures.api()
				.post(`/api/v1/articles/sdsdsd/tags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({tagId : tag.id})
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
				.post(`/api/v1/articles/${post.id}/tags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({tagId : 'string'})
				.expect(400, expectedError)

		})

		it('should return 401 if request is not authenticated', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			}) 
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/tags`)
				.expect(401)

		})
        
		it('should throw an error if Article is already tagged', async () => {
			const tag = await fixtures.insertTag() 
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			}) 
			await fixtures.insertPostTag({
				postId: post.id,
				tagId : tag.id				
			})
		
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/tags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({tagId : tag.id})
				.expect(422)
				.then(res => {
					expect(res.body.message)
						.eql(`Tag is already assigned to post `)
					
				})
		})

	})

	describe('Success', () => {

		it('should return 200', async () => {

			const tag = await fixtures.insertTag() 
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/tags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({tagId : tag.id})
				.expect(200)
			
		})

		it('should return the right response', async () => {
			const tag = await fixtures.insertTag() 
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/tags`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({tagId : tag.id})
				.expect(200)
				.then(res => {

					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  articleId: post.id,
							  tagId: tag.id
							}
						  }
					)
				})
			
		})
	})


})
