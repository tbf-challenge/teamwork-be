const { expect } = require('chai')
const {fixtures, setupDB } = require('../../../test/utils')
const db = require('../../db')
const fetchUsers = require('./fetch-users')

describe('Fetch all users', () => {
	const numberOfUsers = 5
	before(async () => {
		await setupDB()
		await fixtures.insertMultipleUsers(numberOfUsers)
	 })
	it('should fetch users data', async () =>{
		const actualUsers = await fetchUsers()
		const result = await db.query(`
			SELECT * FROM users`)
		return expect(actualUsers).to.eql(result.rows)	
	})

})