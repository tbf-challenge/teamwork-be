const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const generateAccessToken = require('../generate-access-token')
const {fixtures} = require('../../../../test/utils')
const resetPassword = require('./index')
const db = require('../../../db')


describe('Reset user password and verify token', () => {
	let user

	before(async ()=>{
		 user = await fixtures.insertUser() 
	})

	it("should reset a user's password", async () => {
		const token = generateAccessToken(
			{data: {email: user.email}, 
				expiry: '1h'})

		await resetPassword({token, newPassword: faker.internet.password()})
		const {rows} = await db.query(
			`SELECT * FROM users
             WHERE email = $1`,[user.email])
		const updatedUser = rows[0]
		expect(updatedUser.passwordHash).to.not.equal(user.passwordHash)
	})

	it('should throw an error if the token is invalid', async () => {
		try{
			await resetPassword(
				{token: faker.datatype.uuid(), 
					newPassword: faker.internet.password()})
		}catch(e){
			expect(e.message).to.equal('Token is expired/invalid.')
		}
	})

})
