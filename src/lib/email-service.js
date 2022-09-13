const nodemailer = require("nodemailer")
const config = require('../config')


const devConfig = {
	host: config('EMAIL_HOST'),
	port: config('EMAIL_PORT'),
	auth: {
		user: config('EMAIL_USERNAME'),
		pass: config('EMAIL_PASSWORD')
	}
}

const prodConfig = {
	service: config('MAIL_SERVICE'),
	auth: {
		user: config('MAIL_SERVICE_USERNAME'),
		pass: config('MAIL_SERVICE_PASSWORD')
	}
}


/** 
 * Sends a mail 
 * @param {string} from - sender
 * @param {string} to - receiver
 * @param {string} subject - subject of the mail
 * @param {string} text - body of the mail
 * @returns {Promise}
*/
const sendEmail = (from, to, subject, text) => {
	const configOptions = 
	 config("NODE_ENV") === "production" ? prodConfig : devConfig

	const transporter = nodemailer.createTransport(configOptions)

	return transporter.sendMail({
		from,
		to,
		subject,
		text
	})

	
}

module.exports = sendEmail
