const { expect } = require('chai')
const db = require("../../db")
const deletePostTags = require("./delete-post-tag")
const { fixtures } = require('../../../test/utils')


describe('DELETE post tags  ', () => {

	let user

	before(async () => {
		user = await fixtures.insertUser() 
		
	})
				
	it('should delete a tag assigned to a gif ', async () => {

		const tag = await fixtures.insertTag()  
    
		const post = await fixtures.insertPost({
			userId : user.id , 
			type : 'gif'
		})
		await deletePostTags({ 
			postId: post.id,
			tagId: tag.id
		 })
		const expectedPostTags = await db.query(
			`SELECT * FROM posts_tags 
                WHERE "postId" = $1 
                AND "tagId" = $2`,[ post.id, tag.id ])

		expect(expectedPostTags.rowCount).to.eql(0)
		 
	})

	it('should delete a tag assigned to an article ', async () => {

		const tag = await fixtures.insertTag()  
    
		const post = await fixtures.insertPost({
			userId : user.id , 
			type : 'article'
		})
		await deletePostTags({ 
			postId: post.id,
			tagId: tag.id
		 })
		const expectedPostTags = await db.query(
			`SELECT * FROM posts_tags 
                WHERE "postId" = $1 
                AND "tagId" = $2`,[ post.id, tag.id ])

		expect(expectedPostTags.rowCount).to.eql(0)
		 
	})
		

})
