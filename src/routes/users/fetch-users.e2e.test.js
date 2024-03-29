const { expect } = require('chai')
const { fixtures, resetDBTable } = require('../../../test/utils')

describe('GET /users', () => {   
	describe('Failure', ()=> {
		let nonAdminUser
		let accessToken
		before(async () =>{
			nonAdminUser = await fixtures.insertUser({
				role : 'user'
			}) 
			const body = { id: nonAdminUser.id, email: nonAdminUser.email }
			accessToken = fixtures.generateAccessToken(
				{user : body}
			)
		})
		it('should return 403 if user is not an admin', async() =>{
			const expectedError = {
				"status":"failed",
				"message":"Only admin can create users"
			}
			return fixtures.api()
				.get(`/api/v1/users`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(403 , expectedError)
		})
	}) 
	describe('Success', () => {
		const numberOfUsers = 5
		let insertedUsers
		let adminUser
		let accessToken
		before(async () =>{
			await resetDBTable('users')
			insertedUsers= await fixtures.insertMultipleUsers(numberOfUsers)
			adminUser = await fixtures.insertUser({
				role : 'admin'
			}) 
			const body = { id: adminUser.id, email: adminUser.email }
			accessToken = fixtures.generateAccessToken(
				{user : body}
			)
		})
		it('should return 200 if users are fetched', async () =>
			fixtures.api()
				.get(`/api/v1/users`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200))
		it('should return the right number of users', async() =>
			fixtures.api()
				.get(`/api/v1/users`)
				.set('Authorization', `Bearer ${accessToken}`)
				.then(res => {
					expect(res.body.data).to.have.deep.members(
						[...insertedUsers, adminUser].map((user) =>({
							userId : user.id,
							firstName : user.firstName,
							lastName : user.lastName,
							email : user.email,
							gender : user.gender,
							role : user.role,
							jobRole : user.jobRole,
							department : user.department,
							address : user.address,
							profilePictureUrl : user.profilePictureUrl,
							createdOn : user.createdAt.toISOString()

						})))
				}) 
		)	
	})
})