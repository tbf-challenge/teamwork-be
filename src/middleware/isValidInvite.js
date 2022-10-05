const jwt = require('jsonwebtoken')
const config = require('../config')
const { AppError } = require('../lib')


const verify = (req, res, next) => {
	const authHeader = req.headers.authorization

	if (!authHeader)  return next(new AppError('No token provided', 401))

	const token = authHeader.split(' ')[1]

	return jwt.verify(token, config('TOKEN_SECRET'), (err, user) => {

		if (err) return next(new AppError('Invalid token', 401))

        
		if (req.body.email !== user.email) 
			return next(new AppError(
				'Invalid request email', 403))
        
		req.user = user

		return next()
	})


}

module.exports = verify