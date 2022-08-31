const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')
const swaggerUI = require('swagger-ui-express')
const fs = require('fs')
const YAML = require('yaml')

const passportLocal = require('./lib/passport-local')
const passportJwt = require('./lib/passport-jwt')
const { AppError } = require('./lib')
const router = require('./routes')
const globalErrorHandler = require('./middleware/global-errorhandler')

const file = fs.readFileSync('./docs/swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

const app = express()

// TO do
// testing
// http statuscodes
// Database changes
// email should be unique
// some fields should not be required(eg on the post and user tables)

// Middleware
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))


passportLocal(passport)
passportJwt(passport)

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}
app.get('/api/v1/health', (req, res) => {
	res.send('Health is ok!')
})

// Routes
app.use('/api/v1', router)

app.all('*', (req, res, next) => {
	const err = new AppError(
		`Cannot find the requested url ${req.originalUrl}`,
		404
	)
	next(err)
})

app.use(globalErrorHandler)


module.exports = app
