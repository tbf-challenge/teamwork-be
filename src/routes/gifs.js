const express = require('express')
const postService = require('../services/posts')
const { logger } = require('../lib')
const isAuthenticated = require('../middleware/isAuthenticated')
const {
	GifDoesNotExistError
} = require("../services/errors")
const validateSchema = require('../middleware/validateSchema')

const {
	createGifsSchema
	
} = require('../schema')

const log = logger()
const router = express.Router()
const ERROR_MAP = {
	[GifDoesNotExistError.name] : 404
	
}

const transformGifResponse = (gif) => ({
	userId: gif.userId,
	title: gif.title,
	image: gif.content,
	published: gif.published,
	createdOn: gif.createdAt,
	gifId: gif.id,
	type : gif.type
	
})

const createGif = async (req, res, next) => {
	try {
		const userId = req.user.id
		const { title, image } = req.body
		const newGif = await postService.createPost({
			userId,
			title, 
			content : image,
			type : 'gif' })
		res.status(201).json({
			status: 'success',
			data: {
				message: 'GIF image successfully posted',
				...transformGifResponse(newGif)
			}
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

router.use(isAuthenticated())
router
	.route('/')
	.post( validateSchema(createGifsSchema), createGif)

router
	.use((err, req, res, next)=> {
		// eslint-disable-next-line no-param-reassign
		err.success = false
		if(ERROR_MAP[err.name] ){
			// eslint-disable-next-line no-param-reassign
			err.statusCode = ERROR_MAP[err.name]
			
		} 
		next(err)
	})

module.exports = router