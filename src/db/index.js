/* eslint-disable no-console */
const { Pool } = require('pg')

const config = require('../config')()

const credentials = {
    user: config('USER'),
    password: config('PASSWORD'),
    port: config('DATABASE_PORT'),
    host: config('HOST')
}


const pool = new Pool(credentials)

module.exports = {
    async query (text, params) {
        const res = await pool.query(text, params)
        return res
    }
}