const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const passport = require('passport')

const passportLocal = require('./lib/passport-local')
const passportJwt = require('./lib/passport-jwt')
const router = require('./routes')

const app = express()

// Middleware
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());


passportLocal(passport)
passportJwt(passport)

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.get('/api/v1', (req, res) => {
    res.send('Hello friend')
})

// Routes
app.use('/api/v1', router)

module.exports = app
