/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const path = require('path')
const joi = require('joi')

const nodeEnvSchema = joi.object({
	  NODE_ENV: joi.string()
	    .valid('development', 'production', 'test')
		.default('development')
}).unknown()

const environmentSchema = joi.object().keys({	
	DATABASE_URL: joi.string().required(),
	PORT: joi.number().required(),
	TOKEN_SECRET: joi.string().required(),
	EMAIL_SERVICE_HOST: joi.string().required(),
	EMAIL_SERVICE_PORT: joi.number().required(),
	EMAIL_SERVICE_PASSWORD: joi.string().required(),
	EMAIL_SERVICE_USERNAME: joi.string().required(),
	EMAIL_FROM: joi.string().required(),
	FRONTEND_BASE_URL: joi.string().required(),
	ORGANIZATION_NAME: joi.string().required()
}).unknown()

const validateSchema = (schema, env) => {
	const { error, value } = schema.prefs({
		errors: { label: 'key' }
	}).validate(env)
	if (error) {
		throw new Error(`Config validation error: ${error.message}`)
	}
	return value
}

const nodeEnv = validateSchema(nodeEnvSchema, process.env)

if (nodeEnv.NODE_ENV === 'development') { require('dotenv').config() }
if (nodeEnv.NODE_ENV === 'test') {
	require('dotenv').config({ 
		path: path.resolve( '.env.test') 
	})}

module.exports = (key) => {
	const value = validateSchema(environmentSchema, process.env)
	return key ? value[key] : value
}
