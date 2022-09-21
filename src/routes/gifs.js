const express = require('express')
const postService = require('../services/posts')
const isAuthenticated = require('../middleware/isAuthenticated')
const validateSchema = require('../middleware/validateSchema')
const { catchAsync } = require('../lib')

const {
	createGifSchema
	
} = require('../schema')

const router = express.Router()

const transformGifResponse = (gif) => ({
	userId: gif.userId,
	title: gif.title,
	image: gif.content,
	published: gif.published,
	createdOn: gif.createdAt,
	gifId: gif.id
	
})

const createGif = catchAsync( async(req, res) => {
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
})

router.use(isAuthenticated())
router
	.route('/')
	.post( validateSchema(createGifSchema), createGif)

module.exports = router