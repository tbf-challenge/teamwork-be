const { 
	genPasswordHash
} = require("../../lib")
const generateAccessToken = require("./generate-access-token")
const generateRefreshToken = require("./generate-refresh-token")
const customError = require("../../lib/custom-error")
const {
	InviteEmailDoesNotExistError,
	UserAlreadyExistsError
} = require("../errors")
const db = require("../../db")


/**
 * 
 * @param {string} email - email from request body
 * @returns 
 */
const checkUserInvite = async (email) => {

	const { rows } = await db.query(
		`SELECT * FROM user_invites WHERE email = $1`, [email]
	)
	const userInvite = rows[0]
	if (!userInvite) {
		throw customError(InviteEmailDoesNotExistError)
	}
	if (userInvite.status === "active") {
		throw customError(UserAlreadyExistsError)
	}

	return userInvite
}

const createNewUser = async (user) => {
	const {
		firstName,
		lastName,
		email,
		password
	} = user
	
	await checkUserInvite(email)


	const passwordHash = await genPasswordHash(password)
	const refreshToken =  await generateRefreshToken()
	const { rows } = await db.query(
		`INSERT INTO users ("firstName", "lastName", "email", "passwordHash"
		, "refreshToken") 
		 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
		[
			firstName,
			lastName,
			email,
			passwordHash,
			refreshToken
		]
	)
	const userProfile = rows[0]
	const body = { id: userProfile.id, email: userProfile.email }
	const accessToken =  generateAccessToken({
		data: {user : body}, 
		expiry : '15m'
	})

	await db.query(
		`UPDATE user_invites 
		SET status = $1 
		WHERE email = $2`, 
		["active", email]
	)

	return { accessToken, refreshToken, userId: userProfile.id }
}

module.exports = createNewUser