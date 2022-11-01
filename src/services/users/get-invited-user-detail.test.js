const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const {fixtures} = require('../../../test/utils')
const getInvitedUserDetail = require('./get-invited-user-detail')


describe('Get invited-user information', () => {	

	describe('Failure', async()=>{
		const	invalidInviteToken = fixtures.generateAccessToken({
			email : faker.internet.email()
		})
		it('should throw an error if the invite is invalid', async () =>
			expect(getInvitedUserDetail(invalidInviteToken))
				.to.be.rejectedWith(
					'Invite is invalid/expired')
		)
	})

	describe('Success', async()=>{

		let inviteUserData
		let inviteToken
		let invites

		before(async () => {
			inviteUserData = {
				email : faker.internet.email()
			}

			inviteToken = fixtures.generateAccessToken(inviteUserData)
			invites = await fixtures.insertUserInvite(
				{email: inviteUserData.email})
		
		})
		it('should get invited user information', async () =>{
	
			const invitedUser = await getInvitedUserDetail(inviteToken)
		
			return expect(invitedUser).to.include({
				email : invites.email,
				userId: undefined


			})

		})	
	})
})