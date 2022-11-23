const {expect} = require('chai')
const db = require("../../db")
const fetchPosts = require("./fetch-posts")
const {fixtures, resetDBTable} = require('../../../test/utils')

describe('Fetch all posts', () => {

	const numberOfPosts = 5
	let user 
	let posts

	before(async () => {
        
		user = await fixtures.insertUser()
		await resetDBTable('posts')
		posts = await fixtures.insertMultiplePosts(user.id, numberOfPosts)

	 })
	 
	it('should fetch posts', async () =>{
		const actualPosts = await fetchPosts()

		const result = await db.query(`
		SELECT posts.id, posts."userId" , posts.title, posts.image,
        posts.content,posts.published, posts."createdAt", posts.type,
        posts."likesCount",
        users."firstName", users."lastName", users.email, 
        users."profilePictureUrl" 
	    FROM posts
	    INNER JOIN users on posts."userId" = users.id;
        `)
		return expect(actualPosts).to.eql(result.rows)	
	})

	it('should fetch flagged posts', async () =>{
	
		await fixtures.insertPostFlag({
			userId : user.id ,
			postId : posts[0].id
		})
		const actualPosts = await fetchPosts(true)
        

		const result = await db.query(`
		SELECT posts.id, posts."userId" , posts.title, posts.image,
		posts.content,posts.published, posts."createdAt", posts.type,
		posts."likesCount", posts."flagsCount",
		users."firstName", users."lastName", users.email,
		users."profilePictureUrl" 
		FROM posts
		INNER JOIN users on posts."userId" = users.id
		WHERE posts."flagsCount" > 0
		ORDER BY "flagsCount" DESC;
        `)

		return expect(actualPosts).to.eql(result.rows)	
	})

	it('should fetch unflagged posts', async () =>{
		await resetDBTable('post_flags')
	
		await fixtures.insertPostFlag({
			userId : user.id ,
			postId : posts[0].id
		})
		const actualPosts = await fetchPosts(false)
        

		const result = await db.query(`
		SELECT posts.id, posts."userId" , posts.title, posts.image,
		posts.content,posts.published, posts."createdAt", posts.type,
		posts."likesCount", posts."flagsCount",
		users."firstName", users."lastName", users.email,
		users."profilePictureUrl" 
		FROM posts
		INNER JOIN users on posts."userId" = users.id
 		WHERE posts."flagsCount" = 0
		ORDER BY "flagsCount" DESC;
        `)

		return expect(actualPosts).to.eql(result.rows)	
	})
})