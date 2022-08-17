/* eslint-disable no-underscore-dangle */

const { isBoolean, includes, map, has, get } = require('lodash')
const { schemas } = require('../lib')

module.exports = (shouldUseJoiError = false) => {
	// useJoiError determines if we should respond with the base Joi error
	// boolean: defaults to false
	const useJoiError = isBoolean(shouldUseJoiError) && shouldUseJoiError
  
	// enabled HTTP methods for request data validation
	const supportedMethods = ['post', 'put']
  
	// Joi validation options
	const validationOptions = {
		abortEarly: false,  // abort after the last validation error
		allowUnknown: true, // allow unknown keys that will be ignored
		stripUnknown: true  // remove unknown keys from the validated data
	}
  
	// return the validation middleware
	// eslint-disable-next-line consistent-return
	return (req, res, next) => {
		const route = req.route.path
		const method = req.method.toLowerCase()
    
		if (includes(supportedMethods, method) && has(schemas, route)) {
			// get schema for the current route
			const schema = get(schemas, route)

			if (schema) {
				// Validate req.body using the schema and validation options
				const { value, error } = schema
					.validate(req.body, validationOptions)

				if(error){
					// Joi Error
					const JoiError = {
						status: 'failed',
						error: {
							original: error._object,
							// fetch only message and type from each error
							details: map(error.details, ({message, type}) => ({
								message: message.replace(/['"]/g, ''),
								type
							}))
						}
					}

					// Custom Error
					const CustomError = {
						status: 'failed',
						error: 
            'Invalid request data. Please review request and try again.'
					}
					return res.status(422)
						.json(useJoiError ? JoiError : CustomError)
				} 
				req.body = value
				next()
        
			}
		}
		next()
	}
}