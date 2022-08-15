const express = require('express')

const users = require('./users')
const posts = require('./posts')

const app = express.Router()

// module.exports = (app) => {
app.use('/users', users)
app.use('/feed', posts)
// }

module.exports = app
