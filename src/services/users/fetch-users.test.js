const { expect } = require('chai')
const {fixtures , setupDB} = require('../../../test/utils')
const fetchUsers = require('./fetch-users')

describe('Fetch all users', () => {
	const numberOfUsers = 5
	let users
	beforeEach(async () => {
		await setupDB()
		users = await fixtures.insertMultipleUsers(numberOfUsers)
	 })

	describe('Success', () => {

		it('should return the right response', async () =>{
			const actualUsers = await fetchUsers()
			return expect(actualUsers.length).to.eql(users.rowCount)	
		})
	})
	describe('Failure', () => {

		it('should return the wrong number of users', async () =>{
			await fetchUsers()
			return expect(users.rowCount).to.not.eql(6)	
		})
	})
})