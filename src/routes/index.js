const express = require('express')

const users = require('./users')
const auth = require('./auth')
const posts = require('./posts')

const app = express.Router()

app.use('/users', users)

app.use('/articles', posts)
app.use('/feed', posts)
app.use('/auth', auth)

module.exports = app
