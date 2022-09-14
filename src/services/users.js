const jwt = require("jsonwebtoken")
const { genPasswordHash, verifyPassword, emailService } = require("../lib")

const config = require("../config")
const db = require("../db")
const { AppError } = require("../lib")

const frontendUrl = config("FE_URL")

const invalidEmailAndPassword = "Invalid email or password."
const createNewUser = async (user) => {
	const [
		firstName,
		lastName,
		email,
		password,
		gender,
		jobRole,
		department,
		address
	] = user
	const passwordHash = await genPasswordHash(password)
	// eslint-disable-next-line max-len
	const { rows, error } = await db.query(
		// eslint-disable-next-line max-len
		'INSERT INTO users ("firstName", "lastName", "email", "passwordHash", "gender", "jobRole", "department", "address") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
		[
			firstName,
			lastName,
			email,
			passwordHash,
			gender,
			jobRole,
			department,
			address
		]
	)

	if (error) {
		throw error
	}
	const userProfile = rows[0]
	const body = { id: userProfile.id, email: userProfile.email }
	const token = jwt.sign({ user: body }, config("TOKEN_SECRET"))

	return { token, userId: userProfile.id }
}

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

const signInUserByEmail = async (email, password) => {
	const user = await getUserByEmail(email)

	const isPasswordSame = await verifyPassword(password, user.passwordHash)
	if (!isPasswordSame) {
		throw new AppError(invalidEmailAndPassword, 401)
	}

	const body = { id: user.id, email: user.email }
	const token = jwt.sign({ user: body }, config("TOKEN_SECRET"))

	return { token, userId: user.id }
}

/**
 * service to invite user
 * @param {string} email - email of the user to be invited
 * @returns {object}
 */
const inviteUser = async (email) => {

	const token = jwt.sign({ email }, 
		config("TOKEN_SECRET"),
		 {expiresIn: "7d"})

	const url = `${frontendUrl}/signup?token=${token}`

	const text = `Hi,
	\n\nPlease click on the following link to complete your registration:
	\n${url}\n\nIf you did not request this, please ignore this email.\n`

	await emailService({ to: email, subject: "Invitation to signup", text })

	const { rows, error } = await db.query(
		`INSERT INTO user_invites ("email") VALUES ($1) RETURNING *`, [email])

	if (error) {
		throw error
	}
	const signupInfo = rows[0]

	return signupInfo
}


module.exports = {
	createNewUser,
	getUserByEmail,
	signInUserByEmail,
	inviteUser
}
