/* eslint-disable prefer-regex-literals */
const Joi = require('joi')

const authSchema = Joi.object({
	firstName: Joi.string()
		.alphanum()
		.min(3)
		.max(30)
		.required(),

	lastName: Joi.string()
		.alphanum()
		.min(3)
		.max(30)
		.required(),

	password: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: {
				allow: ['com', 'net']
			}
		})
		.required(),
	gender: Joi.string().valid(
		'female',
		'male',
		'non-binary',
		'transgender',
		'intersex',
		'none'
	)
		.lowercase()
		.required(),
	jobRole: Joi.string().valid(
		'admin',
		'user'
	)
		.lowercase()
		.required(),
	department: Joi.string()
		.valid(
			'sales',
			'human resource',
			'product development',
			'infrastructure',
			'security',
			'research and development',
			'customer support',
			'software developers'
		)
		.lowercase()
		.required(),
	address: Joi.string()
		.min(3)
		.max(100)
		.required()
})

const signinSchema = Joi.object({
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: {
				allow: ['com', 'net']
			}
		})
		.required(),
	password: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

})

const postSchema = Joi.object({
	userId: Joi.number()
		.required(),
	title: Joi.string()
		.alphanum()
		.min(3)
		.max(30)
		.required(),
	image: Joi.string()
		.alphanum(),
	content: Joi.string(),
	published: Joi.boolean()
})

module.exports = {
	'/create-user': authSchema,
	'/signin': signinSchema,
	'/articles': postSchema
}
