const bcrypt = require('bcrypt')

const genPasswordHash = async (password) => {
	const saltRounds = 10
	const salt = await bcrypt.genSalt(saltRounds)
	const passwordHash = await bcrypt.hash(password, salt)
	return passwordHash
}

const verifyPassword = async (password, hashPassword) => {
	const isSimilar = await bcrypt.compare(password, hashPassword)
	return isSimilar
}

module.exports = {
	genPasswordHash,
	verifyPassword
}
