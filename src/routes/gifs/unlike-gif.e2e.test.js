const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')


describe('DELETE /gifs/:id/likes/:userId', () => {
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
		
		it('should return 400 if postId is not a number', async () => {
			const expectedError = {
				"error": {
			  "message": "id must be a number"
				},
		   "status": "failed"
		  }
			return	fixtures.api()
				.delete(`/api/v1/gifs/sdsdsd/likes/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(400, expectedError)

		})
		it('should return 400 if userId is not a number', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			const expectedError = {
				"error": {
				  "message": "userId must be a number"
				},
			   "status": "failed"
			  }
			return fixtures.api()
				.delete(`/api/v1/gifs/${post.id}/likes/sdsdsd`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(400, expectedError)
				 
		})

		it('should return 401 if request is not authenticated', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			}) 
			return fixtures.api()
				.delete(`/api/v1/gifs/${post.id}/likes/${user.id}`)
				.expect(401)

		})
	})

	describe('Success', () => {

		it('should return 200', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			await fixtures.insertPostLike({
				userId : user.id , 
				postId : post.id}) 
			return fixtures.api()
				.delete(`/api/v1/gifs/${post.id}/likes/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
		})
		it('should return the right response', async () => {
			const post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			await fixtures.insertPostLike({
				userId : user.id , 
				postId : post.id}) 
			
			return fixtures.api()
				.delete(`/api/v1/gifs/${post.id}/likes/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
				.then(res => {
					expect(res.body).to.eql(
						{
							status: 'success',
							data: { message: 'GIF image successfully unliked' }
						  }
					)
				})
			
		})
	})


})
