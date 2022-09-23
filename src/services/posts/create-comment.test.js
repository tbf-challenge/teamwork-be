// const {expect} = require('chai')
// const db = require("../../db")
const createComment = require("./create-comment")
const {fixtures} = require('../../../test/utils')


describe('CREATE COMMENT on a gif', () => {
	let user
	before(async ()=>{
		 user = await fixtures.insertUser()  
	})
	it('should comment on a gif', async () => {
		
	    const post = await fixtures.insertPost({
			userId : user.id , 
			type : 'gif'
		})

		await createComment({id: post.id,type: 'gif', userId : post.userId})
		// const queryPost = await db.query(
		// 	`SELECT * FROM posts
		//      WHERE id = $1`,[post.id])
	
		// expect(queryPost.rowCount).to.equal(0)

	})

})