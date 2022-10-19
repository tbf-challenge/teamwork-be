const {expect} = require('chai')
const { faker } = require('@faker-js/faker')
const db = require("../../db")
const createPost = require("./create-post")

const {fixtures} = require('../../../test/utils')


describe('CREATE POST', () => {
	let user
	beforeEach(async ()=>{
		 user = await fixtures.insertUser() 
		 
	})
	describe('Gif', () => {		
		let gif
		beforeEach(async ()=> {
			gif = await createPost({
				userId: user.id,
				title : faker.random.words(),
				image : faker.internet.url(),
				content : faker.internet.url(),
				published : faker.datatype.boolean(),
				type : 'gif'
			})
		})
		it('should insert a gif', async () => {
			const result = await db.query(
				`SELECT * FROM posts
                WHERE id = $1
                AND type = $2
                `,[gif.id , gif.type ])
			expect(result.rowCount).to.equal(1)
    
		})
		it('should return right data', async () => {
			const result = await db.query(
				`SELECT * FROM posts
                WHERE id = $1
                AND type = $2
                `,[gif.id , gif.type ])
			expect(gif).to.eql({
				id : result.rows[0].id,
				userId : result.rows[0].userId,
				title : result.rows[0].title,
				image : result.rows[0].image,
				content : result.rows[0].content,
				published : result.rows[0].published,
				createdAt : result.rows[0].createdAt,
				type : result.rows[0].type
			})
		})
	})
	describe('Article', () => {
		let article
		beforeEach(async ()=>{
			article = await createPost({
				userId: user.id,
				title : faker.random.words(),
				image : faker.internet.url(),
				content : faker.internet.url(),
				published : faker.datatype.boolean(),
				type : 'article'
			})
		})
		it('should insert an article', async () => {
			const result = await db.query(
				`SELECT * FROM posts
                WHERE id = $1
                AND type = $2
                `,[article.id , article.type ])
			expect(result.rowCount).to.equal(1)
    
		})
		it('should return right data', async () => {
			const result = await db.query(
				`SELECT * FROM posts
                WHERE id = $1
                AND type = $2
                `,[article.id , article.type ])
			expect(article).to.eql({
				id : result.rows[0].id,
				userId : result.rows[0].userId,
				title : result.rows[0].title,
				image : result.rows[0].image,
				content : result.rows[0].content,
				published : result.rows[0].published,
				createdAt : result.rows[0].createdAt,
				type : result.rows[0].type
			})
		})	

	})

})