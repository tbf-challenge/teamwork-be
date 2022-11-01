const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const { fixtures } = require('../../../test/utils')

describe('GET /auth/invites/token', () => {

	describe('Failure', () => {

		let invalidInviteToken
		let user
		let accessToken

		before(async () => {
		
			invalidInviteToken = fixtures.generateAccessToken({
				email : faker.internet.email()
			})
			user = await fixtures.insertUser() 
			const body = { id: user.id, email: user.email }
			accessToken = fixtures.generateAccessToken(
				{user : body}
			)
			
		})

		it('should return a 401 error if token is invalid', async () => 
			fixtures.api()
				.get(`/api/v1/auth/invites/${invalidInviteToken}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(401)
				.then(res => {
					expect(res.body.status).to.eql('fail')
					expect(res.body.message).to.eql('Invite is invalid/expired')
				})
		)

	})

	describe('Success', () => {
		let inviteUserData
		let inviteToken
		let user
		let accessToken
		before(async () => {
			inviteUserData = {
				email : faker.internet.email()
			}
	
			inviteToken = fixtures.generateAccessToken(inviteUserData)
			await fixtures.insertUserInvite(
				{email: inviteUserData.email})
				
			user = await fixtures.insertUser() 
			const body = { id: user.id, email: user.email }
			accessToken = fixtures.generateAccessToken(
				{user : body}
			)	
			
		})

		it('should return 201', async () => 
			fixtures.api()
				.get(`/api/v1/auth/invites/${inviteToken}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect('Content-Type', /json/)
				.expect(200)
		)

		it('should return the right response', async () => 			
			fixtures.api()
				.get(`/api/v1/auth/invites/${inviteToken}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
				.then((res) => {
					expect(res.body.data.accessToken).to.be.an('string')
					delete res.body.data.accessToken
					expect(res.body).to.eql({
						status : 'success',
						data: {
							email : inviteUserData.email
						}
					})
				})
		)
	})
})