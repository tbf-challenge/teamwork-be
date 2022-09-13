const nodemailer = require("nodemailer")
const config = require('../config')

let transportConfig

if (config("NODE_ENV") === "production"){
	transportConfig = {
		service: config('MAIL_SERVICE'),
		auth: {
			user: config('MAIL_SERVICE_USERNAME'),
			pass: config('MAIL_SERVICE_PASSWORD')
		}
	}
} else {
	transportConfig = {
		host: config('EMAIL_HOST'),
		port: config('EMAIL_PORT'),
		auth: {
			user: config('EMAIL_USERNAME'),
			pass: config('EMAIL_PASSWORD')
		}
	}
}

const transporter = nodemailer.createTransport(transportConfig)


/** 
 * Sends a mail 
 * @param {string} from - sender
 * @param {string} to - receiver
 * @param {string} subject - subject of the mail
 * @param {string} text - body of the mail
 * @returns {Promise}
*/
const sendEmail = ({ from=config('EMAIL_FROM'), to, 
	subject, text }) => transporter
	.sendMail({
		from,
		to,
		subject,
		text
	})

module.exports = sendEmail
