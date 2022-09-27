const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const db = require('../../../db')
const createNewUser = require('./create-new-user')

const addUserToInvite = async () => {
	const signUpEmail = faker.internet.email()
	const { rows:inviteRows }=  await db.query(
		`INSERT INTO user_invites 
        ("email") VALUES ($1) RETURNING *`, [signUpEmail])
        
	return inviteRows[0]
}

const updateUserToActive = async (email) => {
	await db.query(
		`UPDATE user_invites SET status = 'active' WHERE email = $1`, [email])
}
describe('Create a New User', () => {

	it('should throw an error if the invite is invalid', async () =>{
		const password = faker.internet.password()
		const email = faker.internet.email()
		const firstName = faker.name.firstName()
		const lastName = faker.name.lastName()
		return expect(createNewUser({
			firstName, lastName, email, password}))
			.to.be.rejectedWith(
				'Email is not present in invites list')
	})
    
	it('should throw an error if user already exists', async () =>{
		const password = faker.internet.password()
		const 	signupInfo = await addUserToInvite()
		const { email } = signupInfo
		await updateUserToActive(email)
		const firstName = faker.name.firstName()
		const lastName = faker.name.lastName()
        
		return expect(createNewUser({
			firstName, lastName, email, password}))
			.to.be.rejectedWith(
				'User already exists')
	})


	it('should create a new user', async () =>{
		const password = faker.internet.password()
		const signupInfo = await addUserToInvite()
		const { email } = signupInfo
		const firstName = faker.name.firstName()
		const lastName = faker.name.lastName()

		await createNewUser({
			firstName, lastName, email, password})

		const {rows} = await db.query(
			`SELECT * FROM users
             WHERE email = $1`,[email] )

		const createdUser = rows[0]
		return expect(createdUser).to.exist
	})


})