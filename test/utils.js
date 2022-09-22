const { default: pgMigrate} = require('node-pg-migrate')
const path = require('path')
const { faker } = require('@faker-js/faker')
const db = require('../src/db')
const config = require('../src/config')
const { 
	genPasswordHash
} = require("../src/lib/passwordlib")
const generateRefreshToken = 
require("../src/services/users/generate-refresh-token")

const tearDown = () => 
	db.query("DROP SCHEMA public CASCADE;CREATE SCHEMA public;")

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
				'marketting', 'finance', 'sales', 'technology']),
			address : faker.address.city(),
			jobRole : faker.random.word(),
			refreshToken : faker.internet.password()
			
		}
		const newData = {...userData, ...overrides}
		const passwordHash = await genPasswordHash(newData.password)
		const newRefreshToken =  await generateRefreshToken(
			newData.refreshToken 
		)
		const newUser = await db.query(
			`INSERT INTO users
			("firstName", "lastName", email, "passwordHash",
				 gender, role, department, address, "jobRole", "refreshToken")
			 VALUES ($1 , $2 , $3 , $4, $5, $6, $7, $8, $9 , $10) RETURNING *
			`, [newData.firstName , newData.lastName , newData.email, 
				passwordHash, newData.gender, newData.role ,
				newData.department, newData.address, newData.jobRole,
				newRefreshToken
			]
		)
		return newUser.rows[0]
	},
	async insertPost(user,overrides = {}){
		const postData = {
			userId : user.id,
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
	}
}

module.exports = {
	setupDB,
	tearDown,
	fixtures
}
