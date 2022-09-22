const {expect} = require('chai')
const db = require("../../db")
const deletePost = require("./delete-post")
const {fixtures} = require('../../../test/utils')


describe('DELETE gif', () => {
	let user
	before(async ()=>{
		 user = await fixtures.insertUser()  
	})
	it('should delete a gif', async () => {
		
	    const post = await fixtures.insertPost(user)
		await deletePost({id: post.id,type: 'gif'})
		const queryPost = await db.query(
			`SELECT * FROM posts
             WHERE id = $1`,[post.id])
		expect(queryPost.rowCount).to.equal(0)

	})

})