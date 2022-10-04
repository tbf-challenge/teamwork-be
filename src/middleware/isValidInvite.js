const jwt = require('jsonwebtoken')
const config = require('../config')


const verify = (req, res, next) => {
	const authHeader = req.headers.authorization

	if (!authHeader)  {

		return res.status(401).json({
			status: 'failed',
			error:{
				message: 'No token provided.'
			}
		})
	}

	const token = authHeader.split(' ')[1]

	return jwt.verify(token, config('TOKEN_SECRET'), (err, user) => {

		if (err) {
			return res.status(401).json({
				status: 'failed',
				error:{
					message: 'Invalid token'
				}
			})
		}

        
		if (req.body.email !== user.email) 
			return res.status(403).json({
				status: 'failed',
				error:{
					message: 
					'Invalid request. Email in token and body do not match'
				}
			})
        
		req.user = user

		return next()
	})


}

module.exports = verify