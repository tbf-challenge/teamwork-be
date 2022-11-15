const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')


describe('POST /articles/:id/likes', () => {

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
		
		let data
		before(async ()=>{
			data = {
				userId : user.id
			}
		})

		it('should return 400 if article id is not a number', async () => {
			const expectedError = {
				"error": {
			  "message": "id must be a number"
				},
		   "status": "failed"
		  }
			return	fixtures.api()
				.post(`/api/v1/articles/sdsdsd/likes`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(400, expectedError)

		})

		it('should return 401 if request is not authenticated', async () => {

			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			}) 
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/likes`)
				.expect(401)

		})

		it('should return 422 if article is already liked', async () => {

			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			}) 
			await fixtures.insertPostLike({
				userId : user.id,
				postId: post.id,
				type: 'article'
			})
		
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/likes`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(422)
				.then(res => {
					expect(res.body.message)
						.eql(`Article has already been liked`)
					
				})
		})

	})

	describe('Success', () => {
		let data
		before(async ()=>{
			data = {
				userId : user.id
			}
		})
		it('should return 201', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/likes`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
			
		})

		it('should return the right response', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'
			})
			
			return fixtures.api()
				.post(`/api/v1/articles/${post.id}/likes`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(data)
				.expect(201)
				.then(res => {
					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  message: 'Article successfully liked',
							  userId: user.id,
							  articleId: post.id
							}
						  }
					)
				})
			
		})
	})


})
