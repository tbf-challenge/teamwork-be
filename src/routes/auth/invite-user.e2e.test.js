const { faker } = require('@faker-js/faker')
const { expect } = require('chai')
const { fixtures } = require('../../../test/utils')

describe('POST /invite-user', () => {   

	let adminUser
	let adminAccessToken
	let invitedUserInfo

	before(async () => {
		adminUser = await fixtures.insertUser({
			role : 'admin'
		}) 
		adminAccessToken = fixtures.generateAccessToken(
			{user :  { id: adminUser.id, email: adminUser.email }}
		)
		invitedUserInfo = {
			email : faker.internet.email()
		}
	})


	describe('Failure', ()=> {

		it('should return 403 if user is not an admin', async() =>{
			const nonAdminUser = await fixtures.insertUser({
				role : 'user'
			}) 
			const nonAdminAccessToken = fixtures.generateAccessToken(
				{user :  { id: nonAdminUser.id, email: nonAdminUser.email }}
			)
			const expectedError = {
				"status":"failed",
				"message":"Only admin can create users"
			}
			return fixtures.api()
				.post(`/api/v1/auth/invite-user`)
				.set('Authorization', `Bearer ${nonAdminAccessToken}`)
				.expect(403 , expectedError)
		})

		it(`should return a 400 error if email is absent`, async() => {
			const expectedError = {
				"error": {
					"message": "email is required"
				},
				"status": "failed"
			}
    
			return fixtures.api()
				.post('/api/v1/auth/invite-user')
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.expect(400, expectedError)
		})

		it('should return a 400 error if email is invalid', async () => {

			const expectedError = {
				"error": {
					"message": "email must be a valid email"
				},
				"status": "failed"
			}
			return fixtures.api()
				.post('/api/v1/auth/invite-user')
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.send({
					email: 'invalid-email'
				})
				.expect(400, expectedError)
		})
	}) 


	describe('Success', () => {

		it('should return 200 if user is sent an invite', async () =>
			fixtures.api()
				.post(`/api/v1/auth/invite-user`)
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.send(invitedUserInfo)
				.expect(200))
				
		it('should return the right data', async() =>
			fixtures.api()
				.post(`/api/v1/auth/invite-user`)
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.send(invitedUserInfo)
				.then(res => {
					expect(res.body).to.eql({
						"status" : "success",
						"data" : {
							email : invitedUserInfo.email,
							status : 'pending'
						}
					})
						
				})
		)
	})
})