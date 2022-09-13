/* eslint-disable class-methods-use-this */
const nodemailer = require("nodemailer")
const config = require('../config')

module.exports = class Email {
	/** Represents the email sender
     * @constructor
     * @param {object} user - The user object 
     */
	constructor(user) {
		this.to = user.email
		this.firstName = user.firstName
		this.from = config("EMAIL_FROM")
	}

	/**
     * Selectively creates a new transport based on the environment
     * @returns a new nodemailer transport
     */
	newTransport() {

		if (config('NODE_ENV') === 'development') {
			return nodemailer.createTransport({
				host: config('EMAIL_HOST'),
				port: config('EMAIL_PORT'),
				auth: {
					user: config('EMAIL_USERNAME'),
					pass: config('EMAIL_PASSWORD')
				}
			})
		}

		// mail service we decide to use in production
		return nodemailer.createTransport({
			service: config('MAIL_SERVICE'),
			auth: {
				user: config('MAIL_SERVICE_USERNAME'),
				pass: config('MAIL_SERVICE_PASSWORD')
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
