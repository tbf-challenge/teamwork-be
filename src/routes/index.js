const express = require('express')

const users = require('./users')
const posts = require('./posts')

const app = express.Router()

app.use('/users', users)

app.use('/articles', posts)
app.use('/feed', posts)

module.exports = app
