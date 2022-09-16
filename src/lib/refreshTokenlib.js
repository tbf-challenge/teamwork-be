const bcrypt = require('bcrypt')

const verifyRefreshToken = async (oldRefreshToken, refreshToken) => {
	const isSimilar = await bcrypt.compare(oldRefreshToken, refreshToken)
	return isSimilar
}

module.exports = {
	verifyRefreshToken
}