const { default: pgMigrate} = require('node-pg-migrate')
const request = require('supertest')
const path = require('path')
const { faker } = require('@faker-js/faker')
const jwt = require("jsonwebtoken")
const db = require('../src/db')
const config = require('../src/config')
const app = require('../src/app')

const { 
	genPasswordHash
} = require("../src/lib/passwordlib")


const tearDown = () => 
	db.query("DROP SCHEMA public CASCADE;CREATE SCHEMA public;")

const resetDBTable = (table) =>
	 db.query(`
		TRUNCATE ${table} CASCADE;`)

const setupDB = async() => {
	await tearDown()
	await pgMigrate({ 
		dir: path.join('.', 'migrations'),
		databaseUrl: config('DATABASE_URL'),
		direction: 'up',
		migrationsTable: 'pgmigrations'
	})
}

const fixtures = {
	async insertUser(overrides = {}){
		const userData = {
			firstName:faker.name.firstName(),
			lastName :faker.name.lastName(),
			email : faker.internet.email(),
			password : faker.internet.password(),
			gender : faker.helpers.arrayElement(['male', 'female']),
			role : faker.helpers.arrayElement(['admin', 'user']),
			department : faker.helpers.arrayElement([
				'marketing', 'finance', 'sales', 'technology']),
			address : faker.address.city(),
			jobRole : faker.random.word(5),
			profilePictureUrl : faker.image.imageUrl(),
			refreshToken : faker.datatype.uuid()

			
		}
		const newData = {...userData, ...overrides}
		const passwordHash = await genPasswordHash(newData.password)
		const newUser = await db.query(
			`INSERT INTO users
			("firstName", "lastName", email, "passwordHash" ,
			 "profilePictureUrl",gender, role, department, address,
			  "jobRole", "refreshToken")
			 VALUES ($1 , $2 , $3 , $4, $5, $6, $7, $8, $9 , $10, $11)
			  RETURNING *
			`, [newData.firstName , newData.lastName , newData.email, 
				passwordHash, newData.profilePictureUrl, newData.gender,
				newData.role ,newData.department, newData.address, 
				newData.jobRole,newData.refreshToken
			]
		)
		return newUser.rows[0]
		
	},
	 async insertMultipleUsers( numberOfUsers = 5){
		return Promise.all(Array.from({
			 length: numberOfUsers 
		}).map(() =>  fixtures.insertUser()))
	},
	async insertPost(overrides = {}){
		const postData = {
			title : faker.random.words(),
			image : faker.internet.url(),
			content : faker.internet.url(),
			published : faker.datatype.boolean(),
			type : 'gif'

		}
		const newData = {...postData, ...overrides}
		const newPost = await db.query(
			`INSERT INTO posts
		 ("userId", title , image , content , published, type )
		  VALUES ($1 , $2, $3, $4, $5, $6 )
		  RETURNING * `, [
				newData.userId, newData.title , newData.image,
				newData.content, newData.published, newData.type]
		)
		return newPost.rows[0]
	},
	async insertPostLike(overrides = {}){
		const likeData = {
			type : faker.helpers.arrayElement(['gif', 'post'])

		}
		const newData = {...likeData, ...overrides}
		const newLike = await db.query(
			`INSERT INTO post_likes
		 ("userId", "postId")
		  VALUES ($1 , $2 ) 
		  RETURNING *`, [
				newData.userId, newData.postId]
		)
		return newLike.rows[0]
	},
	async insertUserInvite( overrides = {} ){
		const inviteData = {
			email : faker.internet.email()
		}
		const newData = {...inviteData, ...overrides}

		const { rows:inviteRows }=  await db.query(
			`INSERT INTO user_invites 
			("email") VALUES ($1) RETURNING *`, [newData.email])
			
		return inviteRows[0]
	},
	async updateInviteStatus ({email, status="active"}){

		await db.query(
			`UPDATE user_invites 
			SET status = $1 WHERE email = $2`, [status, email] 
		)
	},
	 generateAccessToken (data , duration = '24h'){
		const accessToken = jwt.sign( data , config("TOKEN_SECRET"),
			{expiresIn: duration})
		return accessToken
	}, api(){
		return request(app)
	},

	async insertPostFlag(overrides = {}){
		const likeData = {
			type : faker.helpers.arrayElement(['gif', 'post']),
			reason : faker.random.words()

		}
		const newData = {...likeData, ...overrides}
		const result = await db.query(
			`INSERT INTO post_flags
	 ("userId", "postId", reason)
	  VALUES ($1 , $2, $3 ) 
	  RETURNING *`, [
				newData.userId, newData.postId, newData.reason]
		)
		return result.rows[0]
	},
	async insertTag(overrides = {}){
		const tagData = {
			title : faker.random.word(),
			content: faker.random.words()
		}
		const newData = {...tagData, ...overrides}
		const result = await db.query(
			`INSERT INTO tags
			(title, content) VALUES ($1, $2) RETURNING *`, 
			[newData.title, newData.content]
		)
		return result.rows[0]
	},
	async insertMultipleTags( numberOfTags = 5){
		return Promise.all(Array.from({
			 length: numberOfTags 
		}).map(() =>  fixtures.insertTag()))
	},
	async insertPostComment(overrides = {}){
		const commentData = {
			comment : faker.random.words()
		}
		const newData = {...commentData, ...overrides}
		const result = await db.query(
			`SELECT * FROM posts 
		WHERE id = $1
		AND type = $2 `,
		 [newData.id , newData.type ])
		const post = result.rows[0]
		// if (!post) {
		// 	throw customError(
		// 		type === 'article' ?
		// 			ArticleDoesNotExistForCommentError :
		// 			GifDoesNotExistForCommentError)
		// }
		const queryResult = await db.query(
			`INSERT INTO comments 
			("userId" , "postId" , content)
			 VALUES ($1 , $2 ,$3) RETURNING *`,
			[newData.userId, newData.id, newData.comment]
		)
		const insertedComment = queryResult.rows[0]
		return {post , insertedComment}
	}
}

module.exports = {
	setupDB,
	tearDown,
	fixtures,
	resetDBTable
}
