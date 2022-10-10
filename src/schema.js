const Joi = require('joi')

const authSchema = Joi.object({
	body:{	
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
			.min(8)
			.pattern(/[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/)
			.message('Password should contain special characters')
			.pattern(/(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+/)
			.message('Password should contain alphanumeric characters')
			.pattern(/(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z]+/)
			.message(`Password should contain 
			uppercase and lowercase characters`),

		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: {
					allow: ['com', 'net']
				}
			})
			.required(),
		profilePictureUrl: Joi.string()
			.uri()
	}	
})

const signinSchema = Joi.object({
	body:{
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: {
					allow: ['com', 'net']
				}
			})
			.required(),
		password: Joi.string()
			.required()
	}
})

const createArticleSchema = Joi.object({
	body:{
		userId: Joi.number()
			.required(),
		title: Joi.string()
			.alphanum()
			.min(3)
			.max(30)
			.required(),
		image: Joi.string()
			.uri(),
		article: Joi.string()
			.required(),
		published: Joi.boolean()
	}
})

const updatePostSchema = Joi.object({
	params: {
		id :Joi.number()
			.required()
	},
	body: {
		title: Joi.string()
			.min(3)
			.max(30)
			.required(),
		image: Joi.string()
			.uri(),
		article: Joi.string()
			.required(),
		published: Joi.boolean()
	}
})

const createCommentSchema = Joi.object({
	params: {
		id :Joi.number()
			.required()
	},
	body: {
		userId: Joi.number()
			.required(),
		comment: Joi.string()
			.required()
	}
})

const getPostByIdSchema = Joi.object({
	params: {
		id :Joi.number()
			.required()
	}
})

const deletePostSchema = Joi.object({
	params: {
		id :Joi.number()
			.required()
	}
})
const createTagSchema = Joi.object({
	body: {
		title: Joi.string()
			.max(30)
			.required(),
		content: Joi.string()
	}
})

const updateTagSchema = Joi.object({
	params: {
		tagId :Joi.number()
			.required()
	},
	body: {
		title: Joi.string()
			.max(30)
			.required(),
		content: Joi.string()
	}
})
const deleteTagSchema = Joi.object({
	params: {
		tagId :Joi.number()
			.required()
	}
})

const assignTagToArticleSchema = Joi.object({
	params: {
		articleId :Joi.number()
			.required()
	},
	body: {
		tagId :Joi.number()
			.required()
	}
})

const deleteArticleTagsSchema = Joi.object({
	params: {
		articleId :Joi.number()
			.required(),
		tagId :Joi.number()
			.required()
	}
})

const queryArticleTagsSchema = Joi.object({
	query: {
		tag :Joi.number()
			.required()
	}
})

const inviteUserSchema = Joi.object({
	body: {
		email: Joi.string()
			.email()
			.required()
	}
})
const authTokenSchema = Joi.object({
	body: {
		email: Joi.string()
			.email()
			.required(),
		refreshToken: Joi.string()
			.required()
	}
})


const createGifSchema = Joi.object({
	body:{
		userId: Joi.number()
			.required(),
		title: Joi.string()
			.alphanum()
			.min(3)
			.max(30)
			.required(),
		image: Joi.string()
			.uri()
			.required(),
		published: Joi.boolean()
	},
	params: {
		token: Joi.string()
			.required()
	}
})

const updatePasswordSchema = Joi.object({
	body:{
		newPassword : Joi.string()
			.min(8)
			.pattern(/[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/)
			.message('Password should contain special characters')
			.pattern(/(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+/)
			.message('Password should contain alphanumeric characters')
			.pattern(/(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z]+/)
			.message(`Password should contain 
					uppercase and lowercase characters`)
			.required()
	}
})
const likePostSchema = Joi.object({
	params: {
		id :Joi.number()
			.required()
	},
	body: {
		userId: Joi.number()
			.required()
	}
})
const unlikePostSchema = Joi.object({
	params: {
		id :Joi.number()
			.required(),
		userId: Joi.number()
			.required()
	}
})
const flagPostSchema = Joi.object({
	params: {
		id :Joi.number()
			.required()
	},
	body: {
		userId: Joi.number()
			.required(),
		reason : Joi.string()
	}
})

const unflagPostSchema = Joi.object({
	params: {
		id :Joi.number()
			.required(),
		userId: Joi.number()
			.required()
	}
})

const updateUserSchema = Joi.object({
	params: {
		id: Joi.number()
			.required()
	},
	body: {
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

		email: Joi.string()
			.email()
			.required(),
		gender: Joi.string(),
		jobRole: Joi.string()
			.alphanum()
			.min(3)
			.max(100),
		department: Joi.string()
			.alphanum()
			.min(3)
			.max(100),
		address: Joi.string(),
		profilePictureUrl: Joi.string()
			.uri()
	}
})
module.exports = {
	authSchema,
	signinSchema,
	createArticleSchema,
	updatePostSchema,
	createCommentSchema,
	getPostByIdSchema,
	deletePostSchema,
	createTagSchema,
	updateTagSchema,
	deleteTagSchema,
	assignTagToArticleSchema,
	deleteArticleTagsSchema,
	queryArticleTagsSchema,
	inviteUserSchema,
	authTokenSchema,
	createGifSchema,
	updatePasswordSchema,
	likePostSchema,
	unlikePostSchema,
	flagPostSchema,
	unflagPostSchema,
	updateUserSchema
}
