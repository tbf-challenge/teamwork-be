const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const db = require('../../db')
const {fixtures} = require('../../../test/utils')
const getInvitedUserDetail = require('./get-invited-user-detail')


describe('GET invited-user information', () => {
	
	let invalidInviteToken

	before(async () => {
		
		invalidInviteToken = fixtures.generateAccessToken({
			email : faker.internet.email()
		})
			
	})

	describe('Failure', async()=>{

		it('should throw an error if the invite is invalid', async () =>
			expect(getInvitedUserDetail(invalidInviteToken))
				.to.be.rejectedWith(
					'Invite is invalid/expired')
		)
	})

	describe('Success', async()=>{

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
		it('should get invited user information', async () =>{
			const {email} = inviteUserData
			const query = await getInvitedUserDetail(inviteToken)
			const {rows} = await db.query(
				`SELECT * FROM user_invites
			 WHERE email = $1`,[email] )
			const result = rows[0]
		
			return expect(result).to.eql({
				email : query.email,
				status : "pending"


			})

		})	
	})
})