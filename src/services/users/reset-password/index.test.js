const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const generateAccessToken = require('../generate-access-token')
const {fixtures} = require('../../../../test/utils')
const resetPassword = require('./index')
const db = require('../../../db')
const { verifyPassword } = require('../../../lib')


describe('Reset user password and verify token', () => {
	let user

	before(async ()=>{
		 user = await fixtures.insertUser() 
	})

	it('should throw an error if the token is invalid', async () => 
		expect(resetPassword({
			token: faker.datatype.uuid(), 
			newPassword: faker.internet.password()}))
			.to.be.rejectedWith('Token is expired/invalid.')
	)
    
	it("should reset a user's password", async () => {
		const token = generateAccessToken(
			{data: {email: user.email}, 
				expiry: '1h'})
		const newPassword = faker.internet.password()

		await resetPassword({token, newPassword }) 

		const {rows} = await db.query(
			`SELECT * FROM users
             WHERE email = $1`,[user.email] )

		const updatedUser = rows[0]

		const isSamePassword = await verifyPassword(
			newPassword, updatedUser.passwordHash)
            
		return expect(isSamePassword).to.be.true
	})
        
	
})