const { Pool } = require('pg')
const { logger }= require('../lib')

const log = logger()

const config = require('../config')

const pool = new Pool({ connectionString: config('DATABASE_URL')})
log.success('database successfully connected')
module.exports = {
	async query (text, params) {
		const res = await pool.query(text, params)
		return res
	}
}