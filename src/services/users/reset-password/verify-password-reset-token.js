const jwt = require('jsonwebtoken')
const config = require('../../../config')
const customError = require('../../../lib/custom-error')
const { InvalidResetTokenError } = require('../../errors')


const verify = (token) => 
	jwt.verify(token, config('TOKEN_SECRET'), (err, decoded) => {

		if (err) {
			throw customError(InvalidResetTokenError)
		}

		return decoded
	})


module.exports = verify