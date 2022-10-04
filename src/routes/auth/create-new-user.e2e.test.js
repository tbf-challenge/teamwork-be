const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const { fixtures } = require('../../../test/utils')

describe('POST /auth/create-user', () => {
	const validPassword = 'validPaswword123$'
	describe('Failure', () => {
		let signupInfo
		let inviteToken

		before(async () => {
			signupInfo = {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
				email: faker.internet.email(),
				password: faker.internet.password()
			}
			const data = {
				email: signupInfo.email
			}
			inviteToken = fixtures.generateAccessToken(data)
			await fixtures.insertUserInvite(
				{email: signupInfo.email})
		})

		it(`should return a 400 error if request body is absent`, async() => {
			const expectedError = {
				"error": {
					"message": 
				"firstName is required, lastName is required, email is required"
				},
				"status": "failed"
			}

			return fixtures.api()
				.post('/api/v1/auth/create-user')
				.expect(400, expectedError)
		})
		it(`should return a 400 error if firstName is absent`, async() => {
			const expectedError = {
				"error": {
					"message": "firstName is required"
				},
				"status": "failed"
			}

			return fixtures.api()
				.post('/api/v1/auth/create-user')
				.send({
					lastName: signupInfo.lastName,
					email: signupInfo.email,
					password: validPassword
				})
				.expect(400, expectedError)
		})
		it(`should return a 400 error if lastName is absent`, async() => {
			const expectedError = {
				"error": {
					"message": "lastName is required"
				},
				"status": "failed"
			}

			return fixtures.api()
				.post('/api/v1/auth/create-user')
				.send({
					firstName: signupInfo.firstName,
					email: signupInfo.email,
					password: validPassword
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
				.post('/api/v1/auth/create-user')
				.set('Authorization', `Bearer ${inviteToken}`)
				.send({
					firstName: signupInfo.firstName,
					lastName: signupInfo.lastName,
					email: 'invalid-email.com',
					password: validPassword
				})
				.expect(400, expectedError)
		})

		it('should return an error if password is invalid', async () => {
			const expectedError = {
				"error": {
					"message":
                     // eslint-disable-next-line max-len
                     "password length must be at least 8 characters long, Password should contain special characters, Password should contain alphanumeric characters, Password should contain \n\t\t\tuppercase and lowercase characters"
				},
				"status": "failed"
			}

			return fixtures.api()
				.post('/api/v1/auth/create-user')
				.set('Authorization', `Bearer ${inviteToken}`)
				.send({
					firstName: signupInfo.firstName,
					lastName: signupInfo.lastName,
					email: signupInfo.email,
					password: 'invalid'
				})
				.expect(400, expectedError)
		})

		it('should return a 401 error if token is not provided', async () => {
			const expectedError = {
				"error": {
					"message": "No token provided."
				},
				"status": "failed"
			}

			return fixtures.api()
				.post('/api/v1/auth/create-user')
				.send({
					firstName: signupInfo.firstName,
					lastName: signupInfo.lastName,
					email: signupInfo.email,
					password: validPassword
				})
				.expect(401)
				.then(res => {
					expect(res.body).to.eql(expectedError)
				})
		})

		it('should return a 401 error if token is invalid', async () => {
			const expectedError = {
				"error": {
					"message": "Invalid token"
				},
				"status": "failed"
			}

			return fixtures.api()
				.post('/api/v1/auth/create-user')
				.set('Authorization', `Bearer ${faker.datatype.uuid()}`)
				.send({
					firstName: signupInfo.firstName,
					lastName: signupInfo.lastName,
					email: signupInfo.email,
					password: validPassword
				})
				.expect(401)
				.then(res => {
					expect(res.body).to.eql(expectedError)
				})
		})

		it(`should return a 403 error 
		if request body email is not the same as the email in the token`, 
		 async () => {
			 const expectedError = {
				 "error": {
					 "message": 
					 "Email in token and request body do not match"
				 },
				 "status": "failed"
			 }

			 return fixtures.api()
				 .post('/api/v1/auth/create-user')
				 .set('Authorization', `Bearer ${inviteToken}`)
				 .send({
					 firstName: signupInfo.firstName,
					 lastName: signupInfo.lastName,
					 email: faker.internet.email(),
					 password: validPassword
				 })
				 .expect(403)
				 .then(res => {
					 expect(res.body).to.eql(expectedError)
				 })
		 })
		
	})

	describe('Success', () => {
		let signupInfo
		let inviteToken

		beforeEach(async () => {
			signupInfo = {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
				email: faker.internet.email(),
				password: faker.internet.password()
			}
			const data = {
				email: signupInfo.email
			}
			inviteToken = fixtures.generateAccessToken(data)
			await fixtures.insertUserInvite(
				{email: signupInfo.email})

			
		})

		it('should return 201', async () => 
			fixtures.api()
				.post('/api/v1/auth/create-user')
				.set('Authorization', `Bearer ${inviteToken}`)
				.send({
					firstName: signupInfo.firstName,
					lastName: signupInfo.lastName,
					email: signupInfo.email,
					password: validPassword
				})
				.expect('Content-Type', /json/)
				.expect(201)
		)

		it('should return the right response', async () => {			
			fixtures.api()
				.post('/api/v1/auth/create-user')
				.set('Authorization', `Bearer ${inviteToken}`)
				.send({
					firstName: signupInfo.firstName,
					lastName: signupInfo.lastName,
					email: signupInfo.email,
					password: validPassword
				})
				.expect(201)
				.then((res) => {
					expect(res.body).to.have.property('status', 'success')
					expect(res.body).to.have.property('data')
					expect(res.body.data.accessToken).to.be.a('string')
					expect(res.body.data.refreshToken).to.be.an('string')
					expect(res.body.data.userId).to.be.a('number')
					expect(res.body.data.message)
						.to.eql('User account successfully created')
				})
		})
	})
})