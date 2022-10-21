const { expect } = require('chai')
const db = require('../../db')
const {fixtures} = require('../../../test/utils')
const signInUserByEmail = require('./signin-user-by-email')

describe('User signin', () => {
	let user
	let validPassword
	before(async () => {
		user = await fixtures.insertUser({
			password : 'validPaswword123$'
		})
		validPassword = 'validPaswword123$'
	})

	it('should throw an error if user does not exist', async () => 
		expect(signInUserByEmail('invalid-email' , validPassword))
			.to.be.rejectedWith(
				'Invalid email or password.')
	)

	it('should return the right response', async () => {
		const { id, email} = user
		const result = await signInUserByEmail(
			email, validPassword)

		const { rows } = await db.query(
			`SELECT * FROM users
             WHERE id = $1`, [id])
		const  loggedInUser = rows[0]
		return expect(loggedInUser).to.eql(result.user)

	})

})