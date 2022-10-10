const {expect} = require('chai')
const {fixtures} = require('../../../test/utils')

describe('DELETE /tags/tagId', () => {
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
        
		it('should return 400 if id is not a number', async () => {
			const expectedError = {
				"error": {
					"message": "tagId must be a number"
				},
				"status": "failed"
			}
			return	fixtures.api()
				.delete(`/api/v1/tags/sdsdsd`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(400, expectedError)

		})

		it('should return 401 if request is not authenticated', async () => {
			const tag = await fixtures.insertTag() 
			return fixtures.api()
				.delete(`/api/v1/tags/${tag.id}`)
				.expect(401)

		})
	})

	describe('Success', () => {
		it('should return 200 if tag is deleted', async () => {
			const tag = await fixtures.insertTag() 
			return fixtures.api()
				.delete(`/api/v1/tags/${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
		})

		it('should return the right data', async () => {
			const tag = await fixtures.insertTag() 
			return fixtures.api()
				.delete(`/api/v1/tags/${tag.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
				.then((res)=>{
					expect(res.body.status).to.equal('success')
					expect(res.body.data.message)
						.to.equal('Tag has been successfully deleted')
				})
		})
	})
})