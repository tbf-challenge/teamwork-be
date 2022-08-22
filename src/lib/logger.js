const chalk = require('chalk')

const error = chalk.red
const warn = chalk.hex('#FFA500') // Orange color
const info = chalk.blue

/* eslint-disable no-console */
const logger = () => ({
	error(message) {
		console.log(error(message))
	},

	warn(message) {
		console.log(warn(message))
	},

	info(message) {
		console.info(info(message))
	}
})

module.exports = logger
