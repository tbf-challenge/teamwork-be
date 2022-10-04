const { logger, AppError } = require('../lib')

const log = logger()
const errorCodeForDuplicateField = '23505'

const sendDevError = (error, res) => {
	res.status(error.statusCode).json({
		status: error.status,
		message: error.message,
		error,
		stack: error.stack
	})
}
const sendProdError = (error, res) => {
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message
		})
	} else {
		// handle programming or unknown errors to clients
		log.error(error)
		res.status(500).json({
			status: 'internal server error',
			message: 'Something went wrong!'
		})
	}
}

const handleErrorForDuplicateFields = (error) => {
	const value = error.detail.match(/\(([^)]+)\)/)
	const field = value[1]
	const message = `Field value ${field} already exists. 
    Please use a different ${field}`

	return new AppError(message, 400)
}

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
	
	let error = err
	error.statusCode = err.statusCode || 500
	error.status = err.status || 'Internal server error'

	if (process.env.NODE_ENV === 'production') {
		if (error.code === errorCodeForDuplicateField) {
			error = handleErrorForDuplicateFields(error)
		}
		return sendProdError(error, res)
	}
	return sendDevError(error,res)
}
