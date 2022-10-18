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
		it('should insert a gif', async () => {
			const gif = await createPost({
				userId: user.id,
				title : faker.random.words(),
				image : faker.internet.url(),
				content : faker.internet.url(),
				published : faker.datatype.boolean(),
				type : 'gif'
			})
			const result = await db.query(
				`SELECT * FROM posts
                WHERE id = $1
                AND type = $2
                `,[gif.id , gif.type ])
			expect(result.rowCount).to.equal(1)
    
		})
		it('should return right data', async () => {
			const gif = await createPost({
				userId: user.id,
				title : faker.random.words(),
				image : faker.internet.url(),
				content : faker.internet.url(),
				published : faker.datatype.boolean(),
				type : 'gif'
			})
			const result = await db.query(
				`SELECT * FROM posts
                WHERE id = $1
                AND type = $2
                `,[gif.id , gif.type ])
			expect(gif).to.eql(result.rows[0])
		})
	})
	describe('Article', () => {
		it('should insert an article', async () => {
    
			const article = await createPost({
				userId: user.id,
				title : faker.random.words(),
				image : faker.internet.url(),
				content : faker.internet.url(),
				published : faker.datatype.boolean(),
				type : 'article'
			})
    
			const result = await db.query(
				`SELECT * FROM posts
                WHERE id = $1
                AND type = $2
                `,[article.id , article.type ])
			expect(result.rowCount).to.equal(1)
    
		})
		it('should return right data', async () => {
    
			const article = await createPost({
				userId: user.id,
				title : faker.random.words(),
				image : faker.internet.url(),
				content : faker.internet.url(),
				published : faker.datatype.boolean(),
				type : 'article'
			})
			const result = await db.query(
				`SELECT * FROM posts
                WHERE id = $1
                AND type = $2
                `,[article.id , article.type ])
			expect(article).to.eql(result.rows[0])
		})	

	})

})