/* eslint-disable class-methods-use-this */
const nodemailer = require("nodemailer")

module.exports = class Email {
	/** Represents the email sender
     * @constructor
     * @param {object} user - The user object 
     */
	constructor(user) {
		this.to = user.email
		this.firstName = user.firstName
		this.from = process.env.EMAIL_FROM
	}

	/**
     * Selectively creates a new transport based on the environment
     * @returns a new nodemailer transport
     */
	newTransport() {

		if (process.env.NODE_ENV === 'development') {
			return nodemailer.createTransport({
				host: process.env.EMAIL_HOST,
				port: process.env.EMAIL_PORT,
				auth: {
					user: process.env.EMAIL_USERNAME,
					pass: process.env.EMAIL_PASSWORD
				}
			})
		}

		// mail service we decide to use in production
		return nodemailer.createTransport({
			service: process.env.MAIL_SERVICE,
			auth: {
				user: process.env.MAIL_SERVICE_USERNAME,
				pass: process.env.MAIL_SERVICE_PASSWORD
			}
		})
	}

	/**
     * This method sends the mail
     * @param {string} subject - the subject of the email
     * @param {string} text - The body of the the email
     */
	async send(subject, text) {

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			text 
		}

		await this.newTransport().sendMail(mailOptions)
	}
}
