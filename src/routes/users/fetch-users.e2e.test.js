const { expect } = require('chai')
const { fixtures, setupDB } = require('../../../test/utils')

describe('GET /users', () => {   
	describe('Failure', ()=> {
		let userUser
		let accessToken
		before(async () =>{
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
	describe('Success', () => {
		let adminUser
		let accessToken
		before(async () =>{
			await setupDB()
			await fixtures.insertMultipleUsers()
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
			fixtures.api()
				.get(`/api/v1/users`)
				.set('Authorization', `Bearer ${accessToken}`)
				.then(res => {
				 expect(res.body.length).eql(6)
				}) 
		})	
	})
})