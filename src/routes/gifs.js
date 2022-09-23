const express = require('express')
const postService = require('../services/posts')
const isAuthenticated = require('../middleware/isAuthenticated')
const validateSchema = require('../middleware/validateSchema')
const { catchAsync, AppError } = require('../lib')
const {
	GifDoesNotExistError
	
} = require("../services/errors")

const {
	createGifSchema,
	getPostByIdSchema,
	deletePostSchema
	
} = require('../schema')

const router = express.Router()
const ERROR_MAP = {
	[GifDoesNotExistError.name] : 404
}
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

const getGif = catchAsync( async(req, res) => {
	const { id } = req.params

	const gif = await postService.getPost({
		id,
		type : 'gif'
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
	
})

const deleteGif = catchAsync( async (req, res) => {
	const { id } = req.params


	await postService.deletePost({
		id,
		type : 'gif'
	})

	return res.status(200).json({
		status: 'success',
		data: {
			message: 'GIF image was successfully deleted'
		}
	})
	
})

router.use(isAuthenticated())
router
	.route('/')
	.post( validateSchema(createGifSchema), createGif)
router
	.route('/:id')
	.get(validateSchema(getPostByIdSchema), getGif)
	.delete(validateSchema(deletePostSchema), deleteGif)
router
	.use((err, req, res, next)=> {
		const error = err
		error.success = false
		if(ERROR_MAP[error.name] ){
			next(new AppError( error.message ,ERROR_MAP[error.name] ))
			
		} 
		next(err)
	})

module.exports = router