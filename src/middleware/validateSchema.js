/* eslint-disable no-underscore-dangle */

const {
	 map
} = require('lodash')

/**
 * 
 * @param {object} req this is the request object containing extra details
 * @returns {object} Returns the stripped 
 * request object with body, params and query
 */
const stripReq = (req) => {
	const strippedReq = {
		body: req.body,
		params: req.params,
		query: req.query
	}
	return strippedReq
}


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

			// Strip request 
			const strippedReq = stripReq(req)


			// Validate req.body using the schema and validation options
			const { value,  error } = schema
				.validate(strippedReq, validationOptions)

			if (error) {
				// Joi Error
				const JoiError = {
					status: 'failed',
					error: {
						original: error._object,
						// fetch only message and type from each error
						message: map(error.details, ({ message }) => (
							message.replace(/['"]/g, '')
								.replace('body.', '')
								.replace('query.', '')
								.replace('params.', '')
						)).join(', ')
					}
				}


				return res.status(400)
					.json( JoiError )
			}

			// reassign validated data to request
			req.body = value.body || strippedReq.body
			req.params = value.params || strippedReq.params
			req.query = value.query || strippedReq.query

			return next()
		}
	}
}
