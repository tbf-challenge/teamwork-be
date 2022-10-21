const jwt = require("jsonwebtoken")
const config = require("../../config")
const db = require("../../db")
const generateAccessToken = require("./generate-access-token")
const {
	InvalidInviteError
} = require("../errors")
const customError = require("../../lib/custom-error")

const getInvitedUserDetail = async (token) => {
	try {
		const decoded = jwt.verify(token, config('TOKEN_SECRET'))
		const {email} = decoded
		const result = await  db.query(
			`SELECT * FROM user_invites
            WHERE email = $1 
            `,
			[email]
		)
		const user = result.rows[0]
		if (!user || user.status === "active") {
			throw customError(InvalidInviteError)
		}
		const accessToken =  generateAccessToken({
			data: user, 
			expiry : '24h'
		})
		return { accessToken, email : user.email, userId: user.id }
	} catch(error) {
	 if(error.name === 'TokenExpiredError' ){
	 	throw customError(InvalidInviteError)
		}
		else{
	 	throw error
	 }
	 }
	
}

module.exports = getInvitedUserDetail