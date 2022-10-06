const express = require('express')
const postService = require('../../services/posts')
const isAuthenticated = require('../../middleware/isAuthenticated')
const validateSchema = require('../../middleware/validateSchema')
const { catchAsync, AppError } = require('../../lib')
const {
	GifDoesNotExistError,
	GifHasAlreadyBeenLikedError, 
	GifHasAlreadyBeenFlaggedError
	
} = require("../../services/errors")

const {
	createGifSchema,
	getPostByIdSchema,
	deletePostSchema,
	createCommentSchema,
	likePostSchema,
	unlikePostSchema,
	unflagPostSchema,
	flagPostSchema
	
} = require('../../schema')

const router = express.Router()
const ERROR_MAP = {
	[GifDoesNotExistError.name] : 404,
	[GifHasAlreadyBeenLikedError.name] : 422,
	[GifHasAlreadyBeenFlaggedError.name] : 422
}
const {
	transformGifResponse	
} = require('../common/transformers')

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

const createComment = catchAsync( async (req, res) => {

	const { id } = req.params
	const { userId, comment } = req.body
	const {post, insertedComment} = await postService.createComment({
		userId, 
		id, 
		comment,
		type : 'gif'
	})
	
	return res.status(201).json({
		status: 'success',
		data: {
			message: 'Comment successfully created',
			createdOn: insertedComment.createdAt,
			title: post.title,
			gif: post.content,
			comment: insertedComment.content
		}
	})

})

const likeGif = catchAsync( async(req, res) => {
	const {id} = req.params
	const { userId } = req.body
	const newLike = await postService.likePost({
		userId,
		postId : id,
		type : 'gif'
		 })
	res.status(201).json({
		status: 'success',
		data: {
			message: 'GIF image successfully liked',
			userId : newLike.userId,
			gifId : newLike.postId
		}
	})
})
const unlikeGif = catchAsync( async(req, res) => {
	const {id , userId} = req.params
	await postService.unlikePost({
		userId,
		postId : id,
		type : 'gif'
		 })
	res.status(200).json({
		status: 'success',
		data: {
			message: 'GIF image successfully unliked'
		}
	})
})
const flagGif = catchAsync( async(req, res) => {
	const {id} = req.params
	const { userId, reason } = req.body
	const flaggedGif = await postService.flagPost({
		userId,
		postId : id,
		reason,
		type : 'gif'
		 })
	res.status(201).json({
		status: 'success',
		data: {
			message: 'GIF image successfully flagged',
			userId : flaggedGif.userId,
			gifId : flaggedGif.postId,
			reason : flaggedGif.reason
		}
	})
})

const unflagGif = catchAsync( async(req, res) => {
	const {id , userId} = req.params
	await postService.unflagPost({
		userId,
		postId : id,
		type : 'gif'
		 })
	res.status(200).json({
		status: 'success',
		data: {
			message: 'GIF image successfully unflagged'
		}
	})
})
router.use(isAuthenticated())
router
	.route('/')
	.post( validateSchema(createGifSchema), createGif)
router
	.route('/:id/likes/:userId')
	.delete(validateSchema(unlikePostSchema), unlikeGif )
router
	.route('/:id/likes')
	.post(validateSchema(likePostSchema), likeGif )
router
	.route('/:id/flags')
	.post(validateSchema(flagPostSchema), flagGif )
router
	.route('/:id')
	.get(validateSchema(getPostByIdSchema), getGif)
	.delete(validateSchema(deletePostSchema), deleteGif)
router
	.route('/:id/comment')
	.post(validateSchema(createCommentSchema), createComment)
router
	.route('/:id/flags/:userId')
	.delete(validateSchema(unflagPostSchema), unflagGif )

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