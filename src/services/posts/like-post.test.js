const {expect} = require('chai')
const db = require("../../db")
const likePost = require("./like-post")
const {fixtures} = require('../../../test/utils')


describe('RECORD LIKES on gif', () => {
	let user
	let post
	before(async ()=>{
		 user = await fixtures.insertUser() 
		post = await fixtures.insertPost({
			userId : user.id , 
			type : 'gif'
		})
	})
	it('should throw an error if Gif is already liked', async () => {
		await fixtures.insertPostLike({
			userId : user.id,
			postId: post.id
		})
		return expect(likePost({
			userId: user.id, 
			postId: post.id}))
			.to.be.rejectedWith('Gif has already been liked')

	})


	it('should record likes on a gif', async () => {
		const newPost = await fixtures.insertPost({
			userId : user.id , 
			type : 'gif'
		})
		await likePost({ userId: user.id, postId: newPost.id })
		const result = await db.query(
			`SELECT * FROM post_likes
             WHERE "userId" = $1
             AND "postId" = $2`,[ user.id, post.id ])
		expect(result.rowCount).to.equal(1)

	})

})