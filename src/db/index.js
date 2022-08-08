/* eslint-disable no-console */
const { Pool } = require('pg')

const config = {
    user: '',
    password: '',
    port: '',
    host: ''
}

const pool = new Pool(config)

module.exports = {
    async query (text, params) {
        const res = await pool.query(text, params)
        return res
    }
}