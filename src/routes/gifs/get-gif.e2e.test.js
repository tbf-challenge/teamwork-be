const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')


describe('GET /gifs/:id', () => {
    
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

		it('should return 400 if gif id is invalid', async () => {
			const expectedError = {
				"status" : "failed",
				"error": {
			  "message": "id must be a number"
				}
		  }
			return	fixtures.api()
				.get(`/api/v1/gifs/sdsdsd`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(400, expectedError)

		})

		it('should return 404 if gif does not exist', async () => 
			fixtures.api()
				.get(`/api/v1/gifs/${10000}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(404)
				.then(res => {
					expect(res.body.status).to.eql('fail')
					expect(res.body.message).to.eql('Gif does not exist')
				})

		)
		
	})

	describe('Success', () => {

		let gif
		let comment
		before(async ()=>{
			gif = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'
			})
			comment = await fixtures.insertPostComment({
				id : gif.id,
				userId : gif.userId

			})
		})

		it('should return 200', async () => 

			fixtures.api()
				.get(`/api/v1/gifs/${gif.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
		)

		it('should return the right response', async () =>
		

			fixtures.api()
				.get(`/api/v1/gifs/${gif.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
				.then((res) => {

					expect(res.body).to.eql(
						{
							status: 'success',
							data: {
							  userId: gif.userId,
							  title: gif.title,
							  imageUrl: gif.content,
							  likesCount : gif.likesCount,
							  published: gif.published,
								createdOn: gif.createdAt.toISOString(),
								gifId : gif.id,
								comments: [
									{
										comment : comment.content,
										commentId : comment.id,
										userId : comment.userId
									}
								]
							}
						  
						})
				})
		)
	})

})
