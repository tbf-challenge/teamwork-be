const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')
const compression = require('express-compression')

const passportLocal = require('./lib/passport-local')
const passportJwt = require('./lib/passport-jwt')
const router = require('./routes')

const app = express()

// TO do
// testing
// email
// error handling
// http statuscodes
// Database changes
// email should be unique
// some fields should not be required(eg on the post and user tables)

// Middleware
app.use(compression())
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


passportLocal(passport)
passportJwt(passport)

if(process.env.NODE_ENV === 'development'){
	app.use(morgan('dev'))
}
app.get('/api/v1/health', (req, res) => {
	res.send('Health is ok!')
})

// Routes
app.use('/api/v1', router)

module.exports = app
