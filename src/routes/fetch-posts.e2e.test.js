const { expect } = require('chai')
const { fixtures, resetDBTable } = require('../../test/utils')


describe('GET /feed', () => {   

	let user
	let accessToken

	before(async ()=> {

		user = await fixtures.insertUser({
			role : 'admin'
		})
		const body = { id: user.id, email: user.email }
		accessToken = fixtures.generateAccessToken(
			{user : body}
		)
	})

	describe('Failure', ()=> {

		it('should return 401 if request is not authenticated', async () => 
			fixtures.api()
				.get('/api/v1/feed/')
				.expect(401)
		
		) 

		it('should return 400 if isFlagged is not a boolean', async () => 
			fixtures.api()
				.get(`/api/v1/feed?isFlagged=${'string'}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(400)
		
		) 

		it('should return 403 if non-admin fetches flagged posts', async () => {
			const nonAdminUser = await fixtures.insertUser({
				role : 'user'
			}) 
			const nonAdminAccessToken = fixtures.generateAccessToken(
				{user :  { id: nonAdminUser.id, email: nonAdminUser.email }}
			)
			const expectedError = {
				"status":"failed",
				"message":"Only admin can create users"
			}
			return fixtures.api()
				.get(`/api/v1/feed?isFlagged=${true}`)
				.set('Authorization', `Bearer ${nonAdminAccessToken}`)
				.expect(403 , expectedError)
		
		}) 

	})
	
	describe('Success', () => {

		const numberOfPosts = 3
		let insertedPosts

		beforeEach(async () =>{

			await resetDBTable('posts')
			insertedPosts= await fixtures.insertMultiplePosts(
				user.id,
				numberOfPosts
			)
			
		})

		it('should return 200 if posts are fetched', async () =>
			
			fixtures.api()
				.get(`/api/v1/feed`)
				.set('Authorization', `Bearer ${accessToken}`)
				.expect(200)
		)

		it('should return the right number of posts', async() =>
			
			fixtures.api()
				.get(`/api/v1/feed`)
				.set('Authorization', `Bearer ${accessToken}`)
				.then(res => {

					expect(res.body.data).to.have.deep.members(

						insertedPosts.map((post) =>({
							createdOn: post.createdAt.toISOString(),
							gifId : post.id,
							imageUrl: post.content,
							likesCount : post.likesCount,
							published : post.published,
							title : post.title,
							user: {
								userId: user.id,
								fullName: `${user.firstName} ${user.lastName}`,
								profilePictureUrl : user.profilePictureUrl,
								email : user.email
							}
							
						})))
				}) 
		)	

		it('should return the right number of Flagged posts', async() =>{
			const post = insertedPosts[0]
			await fixtures.insertPostFlag({
				userId : user.id ,
				postId : post.id
			})
		

			return fixtures.api()
				.get(`/api/v1/feed?isFlagged=${true}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.then(res => {
					
					expect(res.body.data[0].flagsCount).to.eql(1)
					delete res.body.data[0].flagsCount

					expect(res.body.data[0]).to.eql({
	
						createdOn: post.createdAt.toISOString(),
						gifId : post.id,
						imageUrl: post.content,
						likesCount : post.likesCount,
						published : post.published,
						title : post.title,
						user: {
							userId: user.id,
							fullName: `${user.firstName} ${user.lastName}`,
							profilePictureUrl : user.profilePictureUrl,
							email : user.email
						}
						
							
					})
				}) 
		})

		it('should return the right number of unFlagged posts', async() =>{
			
			const insertedPost = insertedPosts[2]
			await fixtures.insertPostFlag({
				userId : user.id ,
				postId : insertedPost.id
			})
		

			return fixtures.api()
				.get(`/api/v1/feed?isFlagged=${false}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.then(res => {
					
					expect(res.body.data[0].flagsCount).to.eql(0)
					expect(res.body.data[1].flagsCount).to.eql(0)
					delete res.body.data[0].flagsCount
					delete res.body.data[1].flagsCount
					

					expect(res.body.data).to.have.deep.members(
	
						insertedPosts
							.filter((post, index) => index < 2)
							.map((post) =>({
								createdOn: post.createdAt.toISOString(),
								gifId : post.id,
								imageUrl: post.content,
								likesCount : post.likesCount,
								published : post.published,
								title : post.title,
								user: {
									userId: user.id,
									// eslint-disable-next-line max-len
									fullName:`${user.firstName} ${user.lastName}`,
									profilePictureUrl : user.profilePictureUrl,
									email : user.email
								}
							
							})))	
				})
		}) 
	})
})
