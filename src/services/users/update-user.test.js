const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const db = require('../../db')
const {fixtures} = require('../../../test/utils')
const updateUser = require('./update-user')


describe('Update User', () => {
	let user
	let updatedInfo = {}

	beforeEach(async () => {
		user = await fixtures.insertUser()
		updatedInfo = {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			gender: faker.name.gender(),
			jobRole: faker.name.jobTitle(),
			department: faker.name.jobArea(),
			address: faker.address.streetAddress()
		}
	})

	it('should throw an error if user does not exist', async () => {
		const { id } = user
		const { firstName, lastName, email, gender } = updatedInfo
		await db.query(
			`DELETE FROM users
             WHERE id = $1`, [id])

		return expect(updateUser({ id, firstName, lastName, email, gender }))
			.to.be.rejectedWith(
				'User not found')
	})

	it('should update user', async () => {
		const { id } = user
		const { firstName, lastName, email, 
			gender, jobRole, department, address } = updatedInfo
		const newUpdatedUser = await updateUser(
			{ id, firstName, lastName, email, 
				gender, jobRole, department, address })

		const { rows } = await db.query(
			`SELECT * FROM users
             WHERE id = $1`, [id])

		const  updatedUser = rows[0]

		return expect(newUpdatedUser).to.eql({
			id: updatedUser.id,
			firstName: updatedUser.firstName,
			lastName: updatedUser.lastName,
			email: updatedUser.email,
			gender: updatedUser.gender,
			jobRole: updatedUser.jobRole,
			department: updatedUser.department,
			address: updatedUser.address,
			refreshToken: updatedUser.refreshToken
		})

	})

})