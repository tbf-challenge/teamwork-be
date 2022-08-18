const express = require('express')

const users = require('./users')
const posts = require('./posts')
const tags = require('./tags')

const app = express.Router()

app.use('/users', users)
app.use('/articles', posts)
app.use('/tags', tags)

module.exports = app
