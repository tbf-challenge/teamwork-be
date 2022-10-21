const jwt = require("jsonwebtoken")
const {  
	emailLib 
} = require("../../lib")
const config = require("../../config")
const db = require("../../db")

/**
 * service to invite user
 * @param {string} email - email of the user to be invited
 * @returns {object}
 */
const inviteUser = async (email) => {

	const token = jwt.sign({ email }, 
		config("TOKEN_SECRET"),
		 {expiresIn: "7d"})

	const { rows } = await db.query(
		`INSERT INTO user_invites ("email") VALUES ($1) RETURNING *`, [email])
	
		
	const signupInfo = rows[0]
	

	const url = `${config("FRONTEND_BASE_URL")}/signup?token=${token}`

	const text = `Hi,
	\n\nPlease click on the following link to complete your registration:
	\n${url}\n\nIf you did not request this, please ignore this email.\n`

	await emailLib({ to: email, 
		subject: `Invitation to join the 
		${config("ORGANIZATION_NAME")} organization`, 
		text })

	
	return signupInfo
}

module.exports = inviteUser