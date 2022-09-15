const crypto = require('crypto')

const generateRefreshToken = async(length = 40) => {
	const refreshToken = await crypto.randomBytes(length).toString("hex")
	return refreshToken
}

module.exports = generateRefreshToken