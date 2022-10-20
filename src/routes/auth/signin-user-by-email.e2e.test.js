/* eslint-disable max-len */
const { expect } = require('chai')
const { fixtures } = require('../../../test/utils')

describe('POST /auth/signin', async() => {
	let user
	let validPassword 
	let signinInfo
	// let accessToken
	beforeEach(async ()=> {
		user = await fixtures.insertUser({
			password : 'validPassword123$'
		})
		// const body = { id: user.id, email: user.email }
		// accessToken = fixtures.generateAccessToken(
		// 	{user : body}
		// )
		validPassword = 'validPassword123$'
        
		signinInfo = {
			email : user.email,
			password : validPassword
		}
	})
	describe('Failure', async() => {
		it(`should return a 400 error if request body is absent`, async() => {
			const expectedError = {
				"error": {
					"message": 
				"email is required, password is required"
				},
				"status": "failed"
			}

			return fixtures.api()
				.post('/api/v1/auth/signin')
				.expect(400, expectedError)
		})
		it(`should return a 400 error if email is absent`, async() => {
			const expectedError = {
				"error": {
					"message": "email is required"
				},
				"status": "failed"
			}

			return fixtures.api()
				.post('/api/v1/auth/signin')
				.send({
					password : signinInfo.password
				})
				.expect(400, expectedError)
		})
		it(`should return a 400 error password is absent`, async() => {
			const expectedError = {
				"error": {
					"message": "password is required"
				},
				"status": "failed"
			}

			return fixtures.api()
				.post('/api/v1/auth/signin')
				.send({
					email: signinInfo.email
				})
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
				.post('/api/v1/auth/signin')
				.send({
					email: 'invalid-email.com',
					password: signinInfo.password
				})
				.expect(400, expectedError)
		})

		it('should return an error if password is invalid', async () => 
			fixtures.api()
				.post('/api/v1/auth/signin')
				.send({
					email: signinInfo.email,
					password: "invalid-password"
				})
				.expect(401)
				.then((res) => {
					expect(res.body.error.message).to.eql("Invalid email or password.")
					expect(res.body.error.status).to.eql("fail")
				})
		)
	})

	describe('Success', () => {
		it('should return 201', async () => 
			fixtures.api()
				.post('/api/v1/auth/signin')
				.send({
					email: signinInfo.email,
					password: signinInfo.password
				})
				.expect('Content-Type', /json/)
				.expect(200)
		)

		it('should return the right response', async () => {			
			fixtures.api()
				.post('/api/v1/auth/signin')
				.send({
					email: signinInfo.email,
					password: signinInfo.password
				})
				.expect(200)
				.then((res) => {
					expect(res.body).to.have.property('status', 'success')
					expect(res.body).to.have.property('data')
					expect(res.body.data.accessToken).to.be.a('string')
					expect(res.body.data.refreshToken).to.be.an('string')
					expect(res.body.data.userId).to.be.a('number')
				})
		})
	})
})