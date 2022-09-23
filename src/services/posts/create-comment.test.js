const {expect} = require('chai')
const { faker } = require('@faker-js/faker')
const db = require("../../db")
const createComment = require("./create-comment")

const {fixtures} = require('../../../test/utils')


describe('CREATE COMMENT', () => {
	let user
	let comment 
	before(async ()=>{
		 user = await fixtures.insertUser() 
	})
	beforeEach(async ()=>{
		comment = faker.random.words()
	})
	describe('Gif', () => {
		let post
	
		before(async ()=>{
		 post = await fixtures.insertPost({
				userId : user.id , 
				type : 'gif'

			})
		
		})
		it('should insert a comment on a gif', async () => {

    
			const commentData =	await createComment({
				id: post.id,
				type: 'gif',
				userId : user.id, 
				comment})
    
			const result = await db.query(
				`SELECT * FROM comments
                WHERE id = $1
                `,[commentData.insertedComment.id ])
			expect(result.rowCount).to.equal(1)
    
		})
		it('should return right data', async () => {
    
			const commentData =	await createComment({
				id: post.id,
				type: 'gif',
				userId : user.id, 
				comment})
    
			const result = await db.query(
				`SELECT * FROM comments
                WHERE id = $1
                `,[commentData.insertedComment.id ])
    
			expect(commentData).to.eql({
				post,
				insertedComment: result.rows[0]
			})
		})
	})
	describe('Article', () => {
		let post
	
		before(async ()=>{
		 post = await fixtures.insertPost({
				userId : user.id , 
				type : 'article'

			})
		
		})
		it('should insert a comment on a article', async () => {
    
			const commentData =	await createComment({
				id: post.id,
				type: 'article',
				userId : user.id, 
				comment})
    
			const result = await db.query(
				`SELECT * FROM comments
                WHERE id = $1
                `,[commentData.insertedComment.id ])
			expect(result.rowCount).to.equal(1)
    
		})
		it('should return right data', async () => {
    
			const commentData =	await createComment({
				id: post.id,
				type: 'article',
				userId : user.id, 
				comment})
    
			const result = await db.query(
				`SELECT * FROM comments
                WHERE id = $1
                `,[commentData.insertedComment.id ])
    
			expect(commentData).to.eql({
				post,
				insertedComment: result.rows[0]
			})
		})	

	})

})