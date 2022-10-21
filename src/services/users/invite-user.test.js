const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const db = require('../../db')
const inviteUser = require('./invite-user')


describe('Invite a New User', () => {
	let invitedUser
	before(async () => {
		invitedUser = {
			email : faker.internet.email()
		}
	})
	it('should check if invite is inserted into the database', async () => {
		const { email } = invitedUser
		await inviteUser(email)
		const result = await db.query(
			`SELECT * FROM user_invites 
			WHERE email = $1`, [email])
		return expect(result.rowCount).to.eql(1)
	})
	it('should return the right response', async () => {
		const { email } = invitedUser
		const invite = await inviteUser(email)
		const query = await db.query(
			`INSERT INTO user_invites ("email") 
            VALUES ($1) RETURNING *`, [email])
		const result = query.rows[0]
		return expect(invite).to.eql({
			email : result.email,
			status : result.status
		})
	})
})