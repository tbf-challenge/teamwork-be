/* eslint-disable no-console */
const { Pool } = require('pg')

const config = require('../config')

const pool = new Pool({ connectionString: config('DATABASE_URL') })
console.log('database successfully connected')
module.exports = {
	async query(text, params) {
		const res = await pool.query(text, params)
		return res
	}
}
