const generatePasswordResetLink = require('./generate-password-reset-link')
const {  emailLib } = require("../../../lib")
const config = require("../../../config")


/**
 * Sends a password reset link to the user
 * @param {string} - email of the user
 * @returns {Promise}
 */
const sendPasswordResetLink = async (email) => {

	const url = await generatePasswordResetLink(email)

	const text = `Hi,
	\n\nPlease click on the following link to reset your password:
	\n${url}\n\nIf you did not request this, please ignore this email.\n`

	await emailLib({ to: email,
		 subject: `Reset your ${config("ORGANIZATION_NAME")} password`, text })

}

module.exports = sendPasswordResetLink