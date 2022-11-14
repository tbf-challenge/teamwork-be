const {expect} = require('chai')
const db = require("../../db")
const deletePost = require("./delete-post")
const {fixtures} = require('../../../test/utils')


describe('DELETE post', () => {

	let user

	before(async ()=>{
		 user = await fixtures.insertUser()  
	})

	it('should delete a gif', async () => {
		
	    const post = await fixtures.insertPost({
			userId : user.id , 
			type : 'gif'
		})
		await deletePost({id: post.id,type: 'gif'})
		const queryPost = await db.query(
			`SELECT * FROM posts
             WHERE id = $1`,[post.id])
		expect(queryPost.rowCount).to.equal(0)

	})

	it('should delete an article', async () => {
		
	    const post = await fixtures.insertPost({
			userId : user.id , 
			type : 'article'
		})
		await deletePost({id: post.id,type: 'article'})
		const queryPost = await db.query(
			`SELECT * FROM posts
             WHERE id = $1`,[post.id])
		expect(queryPost.rowCount).to.equal(0)

	})

	it('should decrement likesCount on post', async () => {
		const newPost = await fixtures.insertPost({
			userId : user.id , 
			type : 'article'
		})
		await deletePost({ 
			userId: user.id, 
			postId: newPost.id
	 })
		const result = await db.query(
			`SELECT "likesCount" FROM posts
		 WHERE id = $1`,[ newPost.id ])

		const {likesCount} = result.rows[0]

		const query = await db.query(
			`SELECT COUNT(*) FROM post_likes
		 WHERE "postId" = $1`,[ newPost.id ])
		
		const unlikedPost = Number(query.rows[0].count)
		
		expect(unlikedPost).to.eql(likesCount)	 
	})

})