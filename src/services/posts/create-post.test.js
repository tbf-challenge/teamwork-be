const {expect} = require('chai')
const { faker } = require('@faker-js/faker')
const db = require("../../db")
const createPost = require("./create-post")

const {fixtures} = require('../../../test/utils')


describe('CREATE POST', () => {
	let user
	let post
	beforeEach(async ()=>{
		 user = await fixtures.insertUser() 
		 post = ({
			userId: user.id,
			title : faker.random.words(),
			image : faker.internet.url(),
			content : faker.internet.url(),
			published : faker.datatype.boolean()
		})
		 
	})
	describe('Gif', () => {		
		let gif
		beforeEach(async ()=> {
			gif = await createPost({
				...post,
				type : 'gif'
			})
		})
		it('should insert a gif', async () => {
			const result = await db.query(
				`SELECT * FROM posts
                WHERE id = $1
                AND type = $2
                `,[gif.id , gif.type])
			expect(result.rowCount).to.equal(1)
    
		})
		it('should return right data', async () => {
			const result = await db.query(
				`SELECT * FROM posts
                WHERE id = $1
                AND type = $2
                `,[gif.id , gif.type ])
			const queryResult = result.rows[0]
			expect(gif).to.eql({
				id : queryResult.id,
				userId : queryResult.userId,
				title : queryResult.title,
				image : queryResult.image,
				content : queryResult.content,
				published : queryResult.published,
				createdAt : queryResult.createdAt,
				type : queryResult.type
			})
		})
	})
	describe('Article', () => {
		let article
		beforeEach(async ()=>{
			article = await createPost({
				...post,
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
			const queryResult = result.rows[0]
			expect(article).to.eql({
				id : queryResult.id,
				userId : queryResult.userId,
				title : queryResult.title,
				image : queryResult.image,
				content : queryResult.content,
				published : queryResult.published,
				createdAt : queryResult.createdAt,
				type : queryResult.type
			})
		})	

	})

})