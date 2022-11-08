const nodemailer = require("nodemailer")
const config = require('../config')


const transportConfig = {
	host: config('EMAIL_SERVICE_HOST'),
	port: config('EMAIL_SERVICE_PORT'),
	auth: {
		user: config('EMAIL_SERVICE_USERNAME'),
		pass: config('EMAIL_SERVICE_PASSWORD')
	}
}


let transporter

const createTransport =  () => {
	if(!transporter) {
		transporter = nodemailer.createTransport(transportConfig)
	}

	return transporter

}

/** 
 * Sends a mail 
 * @param {string} from - sender
 * @param {string} to - receiver
 * @param {string} subject - subject of the mail
 * @param {string} text - body of the mail
 * @returns {Promise}
*/
const sendEmail = ({ from=config('EMAIL_FROM'), to, 
	subject, text }) => createTransport()
	.sendMail({
		from,
		to,
		subject,
		text
	})

module.exports = sendEmail
