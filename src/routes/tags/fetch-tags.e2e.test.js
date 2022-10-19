const { expect } = require('chai')
const { fixtures, resetDBTable } = require('../../../test/utils')

describe('GET /tags', () => {   
	let user
	let accessToken
	beforeEach(async ()=> {
		user = await fixtures.insertUser()
		const body = { id: user.id, email: user.email }
		accessToken = fixtures.generateAccessToken(
			{user : body}
		)
	})
	describe('Failure', ()=> {
		it('should return 401 if request is not authenticated', async () => 
			fixtures.api()
				.get('/api/v1/tags/')
				.expect(401)
		) 
		describe('Success', () => {
			const numberOfTags = 5
			let insertedTags
			before(async () =>{
				await resetDBTable('tags')
				insertedTags= await fixtures.insertMultipleTags(numberOfTags)
			
			})
			it('should return 200 if users are fetched', async () =>
				fixtures.api()
					.get(`/api/v1/tags`)
					.set('Authorization', `Bearer ${accessToken}`)
					.expect(200))
			it('should return the right number of tags', async() =>
				fixtures.api()
					.get(`/api/v1/tags`)
					.set('Authorization', `Bearer ${accessToken}`)
					.then(res => {
						expect(res.body.data).to.have.deep.members(
							insertedTags.map((tag) =>({
								id : tag.id,
								content : tag.content,
								title : tag.title

							})))
					}) 
			)	
		})
	})
})