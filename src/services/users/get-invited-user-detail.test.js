const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const {fixtures} = require('../../../test/utils')
const getInvitedUserDetail = require('./get-invited-user-detail')


describe('Get invited user information', () => {	

	let inviteUserData
	let inviteToken
	let invalidInviteToken
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
		invalidInviteToken = fixtures.generateAccessToken({
			email : faker.internet.email(),
			status : 'pending'

		})
	})

	
	it('should throw an error if the invite is invalid', async () =>
		expect(getInvitedUserDetail(invalidInviteToken))
			.to.be.rejectedWith(
				'Invite is invalid/expired')
	)

	it('should get invited user information', async () =>{
	
		const invitedUser = await getInvitedUserDetail(inviteToken)
		const accessToken = fixtures.generateAccessToken(invite)
		return expect(invitedUser).to.eql({
			email : invite.email,
			accessToken
		})

	})	
})
