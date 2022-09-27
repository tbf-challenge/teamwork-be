const {expect} = require('chai')
const db = require("../../db")
const recordPostLikes = require("./record-likes")
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
	
		const result = await db.query(
			`SELECT * FROM post_likes
             WHERE "userId" = $1
             AND "postId" = $2`,[ user.id, post.id ])
		expect(result.rowCount).to.equal(0)
	})


	it('should record likes on a gif', async () => {
		
		await recordPostLikes({ userId: user.id, id: post.id })
		const result = await db.query(
			`SELECT * FROM post_likes
             WHERE "userId" = $1
             AND "postId" = $2`,[ user.id, post.id ])
		expect(result.rowCount).to.equal(1)

	})

})