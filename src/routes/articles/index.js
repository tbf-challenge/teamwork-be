const express = require('express')
const postService = require('../../services/posts')
const { logger } = require('../../lib')
const isAuthenticated = require('../../middleware/isAuthenticated')
const {
	ArticleDoesNotExistForCommentError,
	ArticleDoesNotExistError,
	TagAlreadyAssignedToPostError,
	ArticleHasAlreadyBeenLikedError,
	ArticleHasAlreadyBeenFlaggedError
} = require("../../services/errors")
const validateSchema = require('../../middleware/validateSchema')

const {
	createArticleSchema,
	updatePostSchema ,
	 createCommentSchema ,
	 getPostByIdSchema,
	 deletePostSchema,
	 assignTagToArticleSchema,
	 deleteArticleTagsSchema,
	 queryArticleTagsSchema,
	 likePostSchema,
	 unlikeOrUnflagPostSchema,
	 flagPostSchema
} = require('../../schema')
const { catchAsync} = require('../../lib')

const log = logger()
const router = express.Router()
const ERROR_MAP = {
	[ArticleDoesNotExistForCommentError.name] : 422 ,
	[ArticleDoesNotExistError.name] : 404,
	[TagAlreadyAssignedToPostError.name] : 422,
	[ArticleHasAlreadyBeenLikedError.name] : 422,
	[ArticleHasAlreadyBeenFlaggedError.name] : 422
	
}
const {transformArticleResponse} = require('../common/transformers')

const createArticle = async (req, res, next) => {
	try {
		const userId = req.user.id
		const { title, image, article, published } = req.body
		const newArticle = await postService.createPost({
			userId,
			title, 
			image, 
			content : article,
			published,
		    type : 'article'
		})
		res.status(201).json({
			status: 'success',
			data: {
				message: 'Article successfully posted',
				...transformArticleResponse(newArticle)
			}
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

const createComment = async (req, res, next) => {
	try {
		const { id } = req.params
		const { userId, comment } = req.body
		const {post, insertedComment} = await postService.createComment({
			userId, 
			id, 
			comment,
			type : 'article'
		})
		
		return res.status(201).json({
			status: 'success',
			data: {
				message: 'Comment successfully created',
				createdOn: insertedComment.createdAt,
				articleTitle: post.title,
				article: post.content,
				comment: insertedComment.content
			}
		})
	} catch (err) {
		log.error(err.message)
		return next(err)
	}
}

const getArticle = async (req, res, next) => {
	const { id } = req.params
	try {
		const article = await postService.getPost({
			id,
			type : 'article'
		})
		return res.status(200).json({
			status: 'success',
			data: {
				...transformArticleResponse(article),
				comments: article.comments
					.filter((comment) => comment)
					.map((comment) => ({
						id: comment.id,
						comment: comment.content,
						userId: comment.userId
					}))
			}
		})
	} catch (err) {
		log.error(err.message)
		return next(err)
	}
}

const deleteArticle = async (req, res, next) => {
	const { id } = req.params

	try {
		await postService.deletePost({
			id,
			type : 'article'
		})

		return res.status(200).json({
			status: 'success',
			data: {
				message: 'Article was successfully deleted'
			}
		})
	} catch (err) {
		log.error(err.message)
		return next(err)
	}
}


const updateArticle = async (req, res, next) => {
	const { id } = req.params 
	const { title, article, image, published } = req.body 
	
	try {
		const updatedArticle = await postService.updatePost({
			title,
			content : article,
			image,
			published,
			id
		})
		return res.status(200).json({
			status: 'success',
			data: {
				message: 'Article successfully updated',
				...transformArticleResponse(updatedArticle)
			}
		})
		
	} catch (err) {
		log.error(err.message)
		return next(err)
	}
}

const deleteArticleTags = async (req, res, next) => {
	
	const { articleId, tagId } = req.params
	try {
		 await postService.deletePostTags({
			postId : articleId,
			tagId
		})
		res.status(200).json({
			status: 'success',
			data: {
				message: 'Tag has been removed from post'
			}
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

const queryArticleTags = async (req, res, next) => {
	try {
		const { tag } = req.query
		const feed = await postService.queryPostTags({
			tag
		})
		
		res.status(200).json({
			status: 'success',
			data:  feed.map(transformArticleResponse)

		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

const assignTagToArticle = async (req, res, next) => {
	try {
		const { articleId } = req.params 
		const { tagId } = req.body

		const postsTags = await postService.assignTagToPost({
			postId : articleId,
			tagId
		})
 
		return	res.status(200).json({
			status: 'success',
			data: {
				articleId: postsTags.postId,
				tagId: postsTags.tagId
			}
		})
		
	} catch (err) {
		log.error(err.message)
		return next(err)
	}
}

const likeArticle = catchAsync( async(req, res) => {
	const {id} = req.params
	const { userId } = req.body
	const newLike = await postService.likePost({
		userId,
		postId : id,
		type : 'article'
		 })
	res.status(201).json({
		status: 'success',
		data: {
			message: 'Article successfully liked',
			userId : newLike.userId,
			articleId : newLike.postId
		}
	})
})

const unlikeArticle = catchAsync( async(req, res) => {
	const {id, userId} = req.params

	await postService.unlikePost({
		userId,
		postId : id,
		type : 'article'
		 })

	res.status(200).json({
		status: 'success',
		data: {
			message: 'Article successfully unliked'
		}
	})
})

const flagArticle = catchAsync( async(req, res) => {
	const {id} = req.params
	const { userId, reason } = req.body
	const flaggedArticle = await postService.flagPost({
		userId,
		postId : id,
		reason,
		type : 'article'
		 })
	res.status(201).json({
		status: 'success',
		data: {
			message: 'Article successfully flagged',
			userId : flaggedArticle.userId,
			articleId : flaggedArticle.postId,
			reason : flaggedArticle.reason
		}
	})
})
// ROUTES
router.use(isAuthenticated())
router
	.route('/')
	.post( validateSchema(createArticleSchema), createArticle)
router
	.route('/query')
	.get(validateSchema(queryArticleTagsSchema), queryArticleTags)
router
	.route('/:id')
	.get(validateSchema(getPostByIdSchema), getArticle)
	.delete(validateSchema(deletePostSchema), deleteArticle)
	.patch(validateSchema(updatePostSchema), updateArticle)

router
	.route('/:id/comment')
	.post(validateSchema(createCommentSchema), createComment)
router
	.route('/:id/likes')
	.post(validateSchema(likePostSchema), likeArticle )
router
	.route('/:id/flags')
	.post(validateSchema(flagPostSchema), flagArticle )
router
	.route('/:articleId/tags')
	.post(validateSchema(assignTagToArticleSchema), assignTagToArticle)
router
	.route('/:articleId/tags/:tagId')
	.delete(validateSchema(deleteArticleTagsSchema), deleteArticleTags)
router
	.route('/:id/likes/:userId')
	.delete(validateSchema(unlikeOrUnflagPostSchema), unlikeArticle)
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