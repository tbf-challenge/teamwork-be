const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const db = require('../../db')
const inviteUser = require('./invite-user')
const config = require('../../config')
const emailTemplates = require('../email-templates')
const utils = require('../../../test/utils')


describe('Invite a New User', () => {

	let invitedUser; let sendMailFake
	
	beforeEach(async () => {
		invitedUser = {
			email : faker.internet.email()
		}

		// global.transport is set in test/stub-mailer.js
		sendMailFake = global.transport.sendMail 
		
	})

	it('should check if invite is inserted into the database', async () => {
		const { email } = invitedUser
		await inviteUser(email)
		const result = await db.query(
			`SELECT * FROM user_invites 
			WHERE email = $1`, [email])
		return expect(result.rowCount).to.eql(1)
	})

	it('should send email to the invited user', async () => {
		await inviteUser(invitedUser.email)
        
		const token = utils.fixtures.generateAccessToken({
			email: invitedUser.email
		}, '7d')

		const inviteUrl = `${config("FRONTEND_BASE_URL")}/signup?token=${token}`

		const { subject, text } =  emailTemplates
			.getInviteUserMailSubjectAndBody({
				organizationName: config('ORGANIZATION_NAME'),
				inviteUrl
			})

		expect(sendMailFake.lastArg).to.eql({
			from: config('EMAIL_FROM'),
			to: invitedUser.email,
			subject,
			text
		})
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