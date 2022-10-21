const db = require("../../db")
const { AppError } = require("../../lib")

const invalidEmailAndPassword = "Invalid email or password."

const getUserByEmail = async (email) => {
	const { rows, error } = await db.query(
		"SELECT * FROM users WHERE email = $1",
		[email]
	)

	if (error) {
		throw error
	}
	const userProfile = rows[0]

	if (!userProfile) {
		throw new AppError(invalidEmailAndPassword, 401)
	}

	const user = userProfile
	return user
}
module.exports = getUserByEmail