/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const path = require('path')
const joi = require('joi')


const environmentSchema = joi.object().keys({
	DATABASE_URL: joi.string().required(),
	PORT: joi.number().required(),
	TOKEN_SECRET: joi.string().required(),
	EMAIL_SERVICE_HOST: joi.string().required(),
	EMAIL_SERVICE_PORT: joi.number().required(),
	EMAIL_SERVICE_PASSWORD: joi.string().required(),
	EMAIL_SERVICE_USERNAME: joi.string().required(),
	EMAIL_FROM: joi.string().required(),
	FRONTEND_BASE_URL: joi.string().uri().required(),
	ORGANIZATION_NAME: joi.string().required()
}).unknown()

if (!process.env.NODE_ENV) { process.env.NODE_ENV = 'development' }

if (process.env.NODE_ENV === 'development') { require('dotenv').config() }
if (process.env.NODE_ENV === 'test') {
	require('dotenv').config({ 
		path: path.resolve( '.env.test') 
	})}


const { error, value: envVars } = environmentSchema.validate(process.env)
	
if (error) {
	throw new Error(`Config validation error: ${error.message}`)
}

module.exports = (key) => {
	const value = envVars[key]
	if (value === undefined) {
		throw new Error(`No config for env variable ${key}`)
	} else {
		return value
	}
}
