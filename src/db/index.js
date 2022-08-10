/* eslint-disable no-console */
const { Pool } = require('pg')

const config = require('../config')()

const credentials = {
    user: config('DB_USER'),
    password: config('DB_PASSWORD'),
    port: config('DB_PORT'),
    database: config('DB'),
    host: config('HOST')
}


const pool = new Pool(credentials)

module.exports = {
    async query (text, params) {
        const res = await pool.query(text, params)
        return res
    },
    async connect (err, client, done) {
        return pool.connect(err, client, done);
    },
}