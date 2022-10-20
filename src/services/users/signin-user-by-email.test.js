const { expect } = require('chai')
const db = require('../../db')
const {fixtures} = require('../../../test/utils')
const signInUserByEmail = require('./signin-user-by-email')

describe('User signin', () => {
	let user
	let validPassword
	beforeEach(async () => {
		user = await fixtures.insertUser({
			password : 'validPaswword123$'
		})
		validPassword = 'validPaswword123$'
	})

	it('should throw an error if user does not exist', async () => {
		const { id,email } = user
		await db.query(
			`DELETE FROM users
             WHERE id = $1`, [id])

		return expect(signInUserByEmail(email , validPassword))
			.to.be.rejectedWith(
				'Invalid email or password.')
	})

	it('should signin user', async () => {
		const { id, email} = user
		await signInUserByEmail(
			email, validPassword)

		const { rows } = await db.query(
			`SELECT * FROM users
             WHERE id = $1`, [id])

		const  loggedInUser = rows[0]

		return expect(loggedInUser).to.include({
			firstName: loggedInUser.firstName,
			lastName: loggedInUser.lastName,
			email : loggedInUser.email,
			gender: loggedInUser.gender,
			jobRole: loggedInUser.jobRole,
			department: loggedInUser.department,
			address: loggedInUser.address,
			profilePictureUrl: loggedInUser.profilePictureUrl,
			refreshToken : loggedInUser.refreshToken
		})

	})

})