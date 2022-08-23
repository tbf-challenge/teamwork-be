const { Pool } = require("pg")
const config = require("../config")
const logger = require("../lib/logger")

const log = logger()

const pool = new Pool({
	connectionString: config("DATABASE_URL"),
	ssl: { rejectUnauthorized: false }
})
log.success("database successfully connected")
module.exports = {
	async query(text, params) {
		const res = await pool.query(text, params)
		return res
	}
}
