const {expect} = require('chai')
const db = require("../../db")
const {fixtures} = require('../../../test/utils')
const deleteArticleLike = require("./delete-article-like")


describe('Delete article like', () => {
	let user
	let post

	before(async ()=>{
		user = await fixtures.insertUser() 
		post = await fixtures.insertPost({
			userId : user.id , 
			type : 'article'
		})
	})

	it('should delete a like on an article', async () => { 
		await fixtures.insertPostLike({
			userId : user.id,
			postId: post.id,
			type: 'article'
		})
		await deleteArticleLike({userId: user.id, postId: post.id})
		const queryPost = await db.query(
			`SELECT * FROM post_likes
             WHERE "userId" = $1
             AND "postId" = $2`,[user.id, post.id])
		expect(queryPost.rowCount).to.equal(0)
	})
})