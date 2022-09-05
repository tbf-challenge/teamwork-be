/* eslint-disable no-underscore-dangle */

const {
	 map
} = require('lodash')


module.exports = (schema ) => {
	
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
			const {  error } = schema
				.validate(req, validationOptions)

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

				return res.status(422)
					.json( JoiError )
			}
			return next()
		}
	}
}
