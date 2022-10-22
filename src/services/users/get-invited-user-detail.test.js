const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const db = require('../../db')
const {fixtures} = require('../../../test/utils')
const getInvitedUserDetail = require('./get-invited-user-detail')


describe('GET invited-user information', () => {
	let inviteUserData
	let inviteToken

	before(async () => {
		inviteUserData = {
			email : faker.internet.email()
		}

		inviteToken = fixtures.generateAccessToken(inviteUserData)
		await fixtures.insertUserInvite(
			{email: inviteUserData.email})
		
	})

	describe('Failure', async()=>{

		it('should throw an error if the invite is invalid', async () =>{
			const { email } = inviteUserData
		 await db.query(
				`DELETE FROM user_invites
             WHERE email = $1`, [email])
			return expect(getInvitedUserDetail(inviteToken))
				.to.be.rejectedWith(
					'Invite is invalid/expired')
		})
	})

	describe('Success', async()=>{

		it('should get invited user information', async () =>{
			const {email} = inviteUserData
			await getInvitedUserDetail(inviteToken)
			const {rows} = await db.query(
				`SELECT * FROM user_invites
			 WHERE email = $1`,[email] )
			const result = rows[0]
		
			return expect(result).to.eql({
				email : inviteUserData.email,
				status : result.status


			})

		})	
	})
})