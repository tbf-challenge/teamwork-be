const { expect } = require('chai')
const { fixtures, setupDB } = require('../../../test/utils')
const fetchUsers = require('../../services/users/fetch-users')

describe('GET /users', () => {    
	describe('Success', () => {
		const numberOfUsers = 5
		let adminUser
		let accessToken
		beforeEach(async () =>{
			await setupDB()
			await fixtures.insertMultipleUsers(numberOfUsers)
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
				.expect(200)
		)
		it('should return the right number of users', async() =>{
			const actualUsers = await fetchUsers()
			fixtures.api()
				.get(`/api/v1/users`)
				.set('Authorization', `Bearer ${accessToken}`)
				.then(res => {
				 expect(res.body.length).eql(actualUsers.length)
				}) 
		})	
	})
	describe('Failure', ()=> {
		let userUser
		let accessToken
		beforeEach(async () =>{
			await setupDB()
			userUser = await fixtures.insertUser({
				role : 'user'
			}) 
			const body = { id: userUser.id, email: userUser.email }
			accessToken = fixtures.generateAccessToken(
				{user : body}
			)
		})
		it('should return 403 if user is not an admin', async() =>{
			const expectedError = {
				"status":"failed",
				"message":"Only admin can create users"
			}
			fixtures.api()
				.get(`/api/v1/users`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(403 , expectedError)
		})
	})
})