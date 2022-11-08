const jwt = require("jsonwebtoken")
const {  
	emailLib 
} = require("../../lib")
const config = require("../../config")
const db = require("../../db")
const emailTemplates = require('../email-templates')

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
	

	const inviteUrl = `${config("FRONTEND_BASE_URL")}/signup?token=${token}`

	await emailLib({
		to: email, 
		...emailTemplates.getInviteUserMailSubjectAndBody({
			organizationName: config('ORGANIZATION_NAME'),
			inviteUrl
		})
	})

	
	return signupInfo
}

module.exports = inviteUser