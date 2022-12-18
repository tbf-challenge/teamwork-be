const { expect } = require('chai')
const db = require("../../db")
const queryPostTags = require("./query-post-tags")
const { fixtures, resetDBTable } = require('../../../test/utils')

describe('Query post tags', () => {

	let user
	before(async () => {
		user = await fixtures.insertUser()
		await resetDBTable('posts_tags')
	
	 })
	 
	it('should query post tags', async () => {
		const tag = await fixtures.insertTag()  
    
		const post = await fixtures.insertPost({
			userId : user.id , 
			type : 'article'
		})
		await fixtures.insertPostTag({
			postId: post.id,
			tagId: tag.id
		})

		const postTags = await queryPostTags({tag : tag.id})
		
		const result = await db.query(
			`SELECT posts.id, posts."userId" , posts.title, posts.image, 
            posts.content, posts.published, posts."createdAt", posts.type,
            posts_tags."postId", posts_tags."tagId"
            FROM posts 
            INNER JOIN posts_tags
            ON posts.id = posts_tags."postId" 
            WHERE "tagId"=$1`,[tag.id])
		
		return expect(postTags).to.eql(result.rows)	
	})

})