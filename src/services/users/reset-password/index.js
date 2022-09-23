const { 
	genPasswordHash
} = require("../../../lib")
const db = require("../../../db")
const verifyResetToken = require("./verify-password-reset-token")

const resetPassword = async({ token, newPassword }) => {
	const { email } = verifyResetToken(token)
	const password = await genPasswordHash(newPassword)

	await db.query(
		`UPDATE users 
		SET "passwordHash" = $1 
		WHERE email = $2`, 
		[password, email]
	)
}

module.exports = resetPassword