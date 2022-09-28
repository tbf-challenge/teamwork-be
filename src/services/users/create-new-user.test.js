const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const db = require('../../db')
const {fixtures} = require('../../../test/utils')
const createNewUser = require('./create-new-user')


describe('Create a New User', () => {
	let signupInfo
	let userInfo = {}
	

	beforeEach(async () => {
		userInfo = {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password()
		}
		signupInfo = await fixtures.insertUserInvite()
	})

	it('should throw an error if the invite is invalid', async () =>

		expect(createNewUser({...userInfo}))
			.to.be.rejectedWith(
				'Email is not present in invites list')
	)
    
	it('should throw an error if user already exists', async () =>{
		const { email } = signupInfo
		await fixtures.insertUserInvite({email})
		await fixtures.updateInviteStatus({email})
		return expect(createNewUser({
			firstName:userInfo.firstName,
			lastName:userInfo.lastName, email, 
			password:userInfo.password}))
			.to.be.rejectedWith(
				'User already exists')
	})


	it('should create a new user', async () =>{
		const { email } = signupInfo
		await createNewUser({
			firstName:userInfo.firstName, 
			lastName:userInfo.lastName, email, 
			password:userInfo.password})

		const {rows} = await db.query(
			`SELECT * FROM users
             WHERE email = $1`,[email] )

		const createdUser = rows[0]
		
		return expect(createdUser).to.exist	&& 
			expect(createdUser.firstName).to.equal(userInfo.firstName)

	})

	it('should return the right data', async () => {
		const { email } = signupInfo
		
		const newUser = await createNewUser({
			firstName:userInfo.firstName, 
			lastName:userInfo.lastName, email, 
			password:userInfo.password})

		expect(newUser).to.have
			.property('userId')
		expect(newUser).to.have
			.property('accessToken')
		expect(newUser).to.have
			.property('refreshToken')
	})
	

})