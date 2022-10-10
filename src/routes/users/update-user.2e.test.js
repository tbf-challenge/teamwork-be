const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const { fixtures } = require('../../../test/utils')

describe('PATCH /users/:id', () => {

	describe('Failure', () => {
		let user
		let accessToken
		before(async ()=>{
		 user = await fixtures.insertUser() 
			const body = { id: user.id, email: user.email }
			accessToken = fixtures.generateAccessToken(
				{user : body}
			)
		})
		it('should return 401 if request is not authenticated', async () => 
			fixtures.api()
				.patch(`/api/v1/users/${user.id}`)
				.expect(401)
		)
		it('should return 400 if id is not a number', async () => {
			const expectedError = {
				"error": {
					"message": "id must be a number"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/users/sdsdsd`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(
					{firstName : faker.name.firstName(),
						lastName : faker.name.lastName(),
						email : faker.internet.email()
					})
				.expect(400, expectedError)

		})
        
		it('should return 400 if email is not a valid email', async () => {
			const expectedError = {
				"error": {
					"message": "email must be a valid email"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send(
					{ email: 'sdsdsd',
						firstName: user.firstName,
						lastName: user.lastName })
				.expect(400, expectedError)
		})
		it('should return 400 if firstName is not a string', async () => {
			const expectedError = {
				"error": {
					"message": "firstName must be a string"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ firstName: 123,
					lastName: user.lastName,
					email: user.email })
				.expect(400, expectedError)
		})
		it('should return 400 if lastName is not a string', async () => {
			const expectedError = {
				"error": {
					"message": "lastName must be a string"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ lastName: 123,
					firstName: user.firstName,
					email: user.email })
				.expect(400, expectedError)
		})
		it('should return 400 if jobRole is not a string', async () => {
			const expectedError = {
				"error": {
					"message": "jobRole must be a string"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ jobRole: 123,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email })
				.expect(400, expectedError)
		})
		it('should return 400 if department is not a string', async () => {
			const expectedError = {
				"error": {
					"message": "department must be a string"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ department: 123,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email })
				.expect(400, expectedError)
		})
		it('should return 400 if address is not a string', async () => {
			const expectedError = {
				"error": {
					"message": "address must be a string"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ address: 123,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email })
				.expect(400, expectedError)
		})

		it('should return 400 if gender is not a string', async () => {
			const expectedError = {
				"error": {
					"message": "gender must be a string"
				},
				"status": "failed"
			}
			return fixtures.api()
				.patch(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					gender: 123
				})
				.expect(400, expectedError)
		})

		it('should return 404 if user is not found', async () => 
			
			fixtures.api()
				.patch(`/api/v1/users/${user.id + 2}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					address: faker.address.streetAddress() })
				.expect(404)
				.then((res) => {
					expect(res.body.status).eql('fail')
					expect(res.body.message).eql('User not found')
				})
		)

	})
	describe('Success', () => {
		let user
		let accessToken
		before(async ()=>{
			user = await fixtures.insertUser() 
			const body = { id: user.id, email: user.email }
			accessToken = fixtures.generateAccessToken(
				{user : body}
			)
		})
		it('should return 200 if user is updated', async () => 
			fixtures.api()
				.patch(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					address: faker.address.streetAddress(),
					department: faker.name.jobArea(),
					gender: faker.name.gender() 
				})
				.expect(200)

		)
		it('should return the right response', async () =>
			fixtures.api()
				.patch(`/api/v1/users/${user.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({ 
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					address: faker.address.streetAddress(),
					department: faker.name.jobArea()
				})
				.expect(200)
				.then((res) => {
					expect(res.body.status).eql('success')
					expect(res.body.data).to.have.property('userId')
					expect(res.body.data).to.have.property('firstName')
					expect(res.body.data).to.have.property('lastName')
					expect(res.body.data).to.have.property('email')
					expect(res.body.data).to.have.property('address')
					expect(res.body.data).to.have.property('department')
					expect(res.body.data.firstName).to.be.a('string')
					expect(res.body.data.lastName).to.be.a('string')
					expect(res.body.data.email).to.be.a('string')
					expect(res.body.data.userId).to.be.a('number')
					expect(res.body.data.address).to.be.a('string')
					expect(res.body.data.department).to.be.a('string')
				})
		)

	})
})