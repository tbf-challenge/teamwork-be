/* eslint-disable no-console */
const { Pool } = require('pg')

require('dotenv')

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
}

const pool = new Pool(config)

module.exports = {
    async query(text, params) {
        const res = await pool.query(text, params)
        return res
    },
}
