const express = require('express')
const postService = require('../../services/posts')
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
	 unlikePostSchema,
	 flagPostSchema,
	 unflagPostSchema
} = require('../../schema')
const { catchAsync, AppError} = require('../../lib')

const router = express.Router()
const ERROR_MAP = {
	[ArticleDoesNotExistForCommentError.name] : 422 ,
	[ArticleDoesNotExistError.name] : 404,
	[TagAlreadyAssignedToPostError.name] : 422,
	[ArticleHasAlreadyBeenLikedError.name] : 422,
	[ArticleHasAlreadyBeenFlaggedError.name] : 422
	
}
const {transformArticleResponse} = require('../common/transformers')

const createArticle = catchAsync( async (req, res) => {
	
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
	
})

const createComment = catchAsync( async (req, res) => {

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
	
})

const getArticle =  catchAsync( async (req, res) => {
	const { id } = req.params
	
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
	
})

const deleteArticle = catchAsync( async (req, res) => {
	const { id } = req.params
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
	
})


const updateArticle = catchAsync( async (req, res) => {
	const { id } = req.params 
	const { title, article, image, published } = req.body 

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
		
	
})

const deleteArticleTags = catchAsync(async (req, res) => {
	
	const { articleId, tagId } = req.params
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
	
})

const queryArticleTags = catchAsync( async (req, res) => {
	
	const { tag } = req.query
	const feed = await postService.queryPostTags({
		tag
	})
		
	res.status(200).json({
		status: 'success',
		data:  feed.map(transformArticleResponse)

	})
})

const assignTagToArticle = catchAsync( async (req, res) => {
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
		
})

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

const unflagArticle = catchAsync( async(req, res) => {
	const {id , userId} = req.params
	await postService.unflagPost({
		userId,
		postId : id,
		type : 'article'
		 })
	res.status(200).json({
		status: 'success',
		data: {
			message: 'Article successfully unflagged'
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
	.delete(validateSchema(unlikePostSchema), unlikeArticle)
router
	.route('/:id/flags/:userId')
	.delete(validateSchema(unflagPostSchema), unflagArticle )
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