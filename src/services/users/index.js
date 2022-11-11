const db = require("../../db")
const generateAccessToken = require("./generate-access-token")
const generateRefreshToken = require("./generate-refresh-token")
const updateRefreshToken = require("./update-refresh-token")
const sendPasswordResetLink  = require('./send-password-reset-link')
const resetPassword = require('./reset-password')
const createNewUser = require('./create-new-user')
const updateUser = require('./update-user')
const fetchUsers = require('./fetch-users')
const getInvitedUserDetail = require('./get-invited-user-detail')
const getUserByEmail = require('./get-user-by-email')
const signInUserByEmail = require('./signin-user-by-email')
const inviteUser = require('./invite-user')

const {
	RefreshTokenIsInvalidError
} = require("../errors")
const customError = require("../../lib/custom-error")

const getNewTokens = async (email, currentRefreshToken) => {
	const result = await  db.query(
		`SELECT id , email FROM users 
		WHERE email = $1 
		AND "refreshToken" = $2
		`,
		[email, currentRefreshToken]
	)
	const user = result.rows[0]

	if (!user) {
		throw customError(RefreshTokenIsInvalidError)
	}
	const body = { id: user.id, email: user.email }
	const accessToken =  generateAccessToken({
		data: {user : body},
		expiry : '15m'
	})
	
	const refreshToken = await generateRefreshToken()
	await updateRefreshToken(refreshToken , user.id)

	return { accessToken, refreshToken, userId: user.id }
}


module.exports = {
	createNewUser,
	getUserByEmail,
	signInUserByEmail,
	inviteUser,
	getNewTokens,
	getInvitedUserDetail,
	sendPasswordResetLink,
	resetPassword,
	updateUser,
	fetchUsers
}
