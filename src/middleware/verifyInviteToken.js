const jwt = require('jsonwebtoken')
const config = require('../config')


const verify = (req, res, next) => {
	const authHeader = req.headers.authorization

	if (!authHeader){
		res.status(401).json({
			status: "fail",
			message: "request doesn't contain an authorization header"
		})
	}

	const token = authHeader.split(' ')[1]

	return jwt.verify(token, config('TOKEN_SECRET'), (err, user) => {
		if (err) {
			res.status(403).json({
				status: "failed",
				message: "Invalid token"
			})
		}
        
		if (req.body.email !== user.email) {
			res.status(403).json({
				status: "failed",
				message: "invalid email from request"
			})
		}
        
		req.user = user
		next()
	})


}

module.exports = verify