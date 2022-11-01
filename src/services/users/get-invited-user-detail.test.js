const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const {fixtures} = require('../../../test/utils')
const getInvitedUserDetail = require('./get-invited-user-detail')


describe('Get invited user information', () => {	

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
		let invite

		before(async () => {
			inviteUserData = {
				email : faker.internet.email(),
				status : 'pending'
			}
			inviteToken = fixtures.generateAccessToken(inviteUserData)
			invite = await fixtures.insertUserInvite(
				{email: inviteUserData.email,
					status : 'pending'})
			

		})
		it('should get invited user information', async () =>{
	
			const invitedUser = await getInvitedUserDetail(inviteToken)
			const accessToken = fixtures.generateAccessToken(invite)
			return expect(invitedUser).to.eql({
				email : invite.email,
				accessToken
			})

		})	
	})
})