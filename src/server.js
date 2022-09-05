const app = require('./app')
const { logger } = require('./lib')

const log = logger()

process.on('uncaughtExceptions', (err) => {
	log.error(err.stack)
	log.error('Uncaught Exceptions! Shutting down...')
	process.exit(1)
})

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
	log.info(`App running on port ${port}...`)
})

process.on('unhandledRejection', (err) => {
	log.error(err.stack)
	log.error('Unhandled Rejection! Shutting down...')
	server.close(() => {
		process.exit(1)
	})
})
