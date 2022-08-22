function AppError(message, statusCode) {
	this.name = 'MyError'
	this.message = message
	this.stack = (new Error()).stack
	this.statusCode = statusCode
	this.status = `${statusCode}`.startsWith(4) 
		? 'fail'
		: 'internal server error'
	this.isOperational = true
}
AppError.prototype = new Error

module.exports = AppError