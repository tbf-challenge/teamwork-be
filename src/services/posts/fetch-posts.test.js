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
		
		const feedAndCountData = await fetchPosts()

		const result = await db.query(`
		SELECT posts.id, posts."userId" , posts.title, posts.image,
        posts.content,posts.published, posts."createdAt", posts.type,
        posts."likesCount",
        users."firstName", users."lastName", users.email, 
        users."profilePictureUrl" 
	    FROM posts
	    INNER JOIN users on posts."userId" = users.id
		ORDER BY posts."createdAt" DESC LIMIT ${20};
        `)
        
		const value = await db.query(`SELECT COUNT(posts) FROM posts;`)
		const countData = value.rows[0]
		
		return expect(feedAndCountData).to.eql(
			{
				feed : result.rows,
				count: Number(countData.count)
			})	

	})

	it('should fetch correct number of posts when limit is passed', async () =>{
		
		const limitValue = 3
		const feedAndCountData = await fetchPosts({limit : limitValue})
		
		return expect(feedAndCountData.feed.length).to.eql(limitValue)	

	})

	it('should fetch the correct posts when cursor is passed', async () =>{
		const cursorValue = 2

		const feedAndCountData = await fetchPosts({cursor : cursorValue})
        
		return feedAndCountData.feed.map(post =>
			 expect(post.id).to.be.greaterThan(cursorValue))	

	})

	it('should fetch flagged posts when isFlagged=true', async () =>{
	
		await fixtures.insertPostFlag({
			userId : user.id ,
			postId : posts[0].id
		})

		const feedAndCountData = await fetchPosts({isFlagged : true})
        
		const result = await db.query(`
		SELECT posts.id, posts."userId" , posts.title, posts.image,
		posts.content,posts.published, posts."createdAt", posts.type,
		posts."likesCount", posts."flagsCount",
		users."firstName", users."lastName", users.email,
		users."profilePictureUrl" 
		FROM posts
		INNER JOIN users on posts."userId" = users.id
		WHERE posts."flagsCount" > 0
		ORDER BY "flagsCount" DESC LIMIT ${20};
        `)

		expect(feedAndCountData.feed).to.eql(result.rows)
		feedAndCountData.feed.map(post => 
			expect(post.flagsCount).to.be.greaterThan(0))	
	})

	it('should fetch unflagged posts when isFlagged=false', async () =>{
		await resetDBTable('post_flags')
	
		await fixtures.insertPostFlag({
			userId : user.id ,
			postId : posts[0].id
		})
		const feedAndCountData = await fetchPosts({isFlagged : false})
        

		const result = await db.query(`
		SELECT posts.id, posts."userId" , posts.title, posts.image,
		posts.content,posts.published, posts."createdAt", posts.type,
		posts."likesCount", posts."flagsCount",
		users."firstName", users."lastName", users.email,
		users."profilePictureUrl" 
		FROM posts
		INNER JOIN users on posts."userId" = users.id
 		WHERE posts."flagsCount" = 0
		ORDER BY "flagsCount" DESC LIMIT ${20};
        `)
		
		expect(feedAndCountData.feed).to.eql(result.rows)
		feedAndCountData.feed.map(post => expect(post.flagsCount).to.equal(0))	
	})
})