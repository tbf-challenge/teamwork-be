const db = require("../../db")
const config = require("../../config")
const { AppError } = require("../../lib")
const generateAccessToken = require("./generate-access-token")

/**
 * Generates a new password reset link
 * @param {string} email - email of the user
 * @returns {string} - password reset link
 */


const generateResetLink = async (email) => {

	const { rows } = await db.query(
		"SELECT * FROM users WHERE email = $1",
		[email]
	)

	const userProfile = rows[0]

	if (!userProfile) {
		throw new AppError('Invalid email', 401)
	}
	
	const resetToken = generateAccessToken(
		{ data: { email }, 
			expiry: '1h' })

	const url =
	 `${config("FRONTEND_BASE_URL")}/reset-password?token=${resetToken}`
	return url
}

module.exports = generateResetLink
