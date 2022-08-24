const express = require('express')

const users = require('./users')
const auth = require('./auth')
const posts = require('./posts')
const tags = require('./tags')
const articles = require('./articles')

const app = express.Router()

app.use('/users', users)
app.use('/articles', articles)
app.use('/tags', tags)
app.use('/feed', posts)
app.use('/auth', auth)

module.exports = app
