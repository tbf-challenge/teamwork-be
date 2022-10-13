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
			gender: faker.name.gender(),
			jobRole: faker.name.jobTitle(),
			department: faker.name.jobArea(),
			address: faker.address.streetAddress(),
			profilePictureUrl: faker.image.imageUrl()
		}
	})

	it('should throw an error if user does not exist', async () => {
		const { id } = user
		await db.query(
			`DELETE FROM users
             WHERE id = $1`, [id])

		return expect(updateUser(id, updatedInfo))
			.to.be.rejectedWith(
				'User not found')
	})

	it('should update user', async () => {
		const { id } = user
		await updateUser(
			id, updatedInfo)

		const { rows } = await db.query(
			`SELECT * FROM users
             WHERE id = $1`, [id])

		const  updatedUser = rows[0]


		return expect(updatedUser).to.include({
			firstName: updatedInfo.firstName,
			lastName: updatedInfo.lastName,
			gender: updatedInfo.gender,
			jobRole: updatedInfo.jobRole,
			department: updatedInfo.department,
			address: updatedInfo.address,
			profilePictureUrl: updatedInfo.profilePictureUrl
		})

	})

})