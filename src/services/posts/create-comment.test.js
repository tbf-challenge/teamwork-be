// const {expect} = require('chai')
// const db = require("../../db")
const createComment = require("./create-comment")
const {fixtures} = require('../../../test/utils')


describe('CREATE COMMENT on a gif', () => {
	let postData
	before(async ()=>{
		postData = await fixtures.insertPost()
	})
	it('should comment on a gif', async () => {
		
	    const post = await fixtures.createComment({
			userId : postData.userId , 
			type : 'gif',
			id : postData.id
		})

		await createComment({id: post.id,type: 'gif', userId : post.userId})
		// const queryPost = await db.query(
		// 	`SELECT * FROM posts
		//      WHERE id = $1`,[post.id])
	
		// expect(queryPost.rowCount).to.equal(0)

	})

})