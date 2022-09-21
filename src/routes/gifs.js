const express = require('express')
const postService = require('../services/posts')
const isAuthenticated = require('../middleware/isAuthenticated')
const validateSchema = require('../middleware/validateSchema')
const { catchAsync } = require('../lib')

const {
	createGifSchema,
	getGifByIdSchema
	
} = require('../schema')

const router = express.Router()

const transformGifResponse = (gif) => ({
	userId: gif.userId,
	title: gif.title,
	imageUrl: gif.content,
	createdOn: gif.createdAt,
	gifId: gif.id,
	published : gif.published
	
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

const getGif = async (req, res) => {
	const { id } = req.params

	const gif = await postService.getPost({
		id
	})
	return res.status(200).json({
		status: 'success',
		data: {
			...transformGifResponse(gif),
			comments: gif.comments
				.filter((comment) => comment)
				.map((comment) => ({
					commentId: comment.id,
					comment: comment.content,
					userId: comment.userId
				}))
		}
	})
	
}
router.use(isAuthenticated())
router
	.route('/')
	.post( validateSchema(createGifSchema), createGif)
router
	.route('/:id')
	.get(validateSchema(getGifByIdSchema), getGif)

module.exports = router