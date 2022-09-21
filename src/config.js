/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const path = require('path')

if (!process.env.NODE_ENV) { process.env.NODE_ENV = 'development' }

if (process.env.NODE_ENV === 'development') { require('dotenv').config() }
if (process.env.NODE_ENV === 'test') {
	require('dotenv').config({ 
		path: path.resolve( '.env.test') 
	})}


module.exports = (key) => {
	const value = process.env[key]
	if (value === undefined) {
		throw new Error(`No config for env variable ${key}`)
	} else {
		return value
	}
}
