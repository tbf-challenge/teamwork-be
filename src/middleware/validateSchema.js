/* eslint-disable no-underscore-dangle */

const {
	isBoolean,  map
} = require('lodash')


module.exports = ( schema, shouldUseJoiError = false ) => {
	// useJoiError determines if we should respond with the base Joi error
	// boolean: defaults to false
	const useJoiError = isBoolean(shouldUseJoiError) && shouldUseJoiError

	// Joi validation options
	const validationOptions = {
		abortEarly: false, // abort after the last validation error
		allowUnknown: true, // allow unknown keys that will be ignored
		stripUnknown: true // remove unknown keys from the validated data
	}

	// return the validation middleware
	// eslint-disable-next-line consistent-return
	return (req, res, next) => {
	
		if (schema) {
			// Validate req.body using the schema and validation options
			const { value, error } = schema
				.validate(req.body, validationOptions)

			if (error) {
				// Joi Error
				const JoiError = {
					status: 'failed',
					error: {
						original: error._object,
						// fetch only message and type from each error
						message: map(error.details, ({ message }) => (
							message.replace(/['"]/g, '')
						)).join(', ')
					}
				}

				// Custom Error
				const CustomError = {
					status: 'failed',
					message:
            'Invalid request data. Please review request and try again.'
				}
				return res.status(422)
					.json(useJoiError ? JoiError : CustomError)
			}
			req.body = value
			return next()
		}
	}
}
