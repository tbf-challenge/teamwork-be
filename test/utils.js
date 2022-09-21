const { default: pgMigrate} = require('node-pg-migrate')
const path = require('path')
const db = require('../src/db')
const config = require('../src/config')


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

module.exports = {
	setupDB,
	tearDown
}
