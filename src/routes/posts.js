const express = require('express')
const isAuthenticated = require('../middleware/isAuthenticated')
const { catchAsync} = require('../lib')
const postService = require('../services/posts')
const validateSchema = require('../middleware/validateSchema')
const {
	transformArticleResponse ,
	transformGifResponse
} = require('./common/transformers')
const { fetchPostsSchema } = require('../schema')
const isFlaggedAndIsAdmin = require('../middleware/isFlaggedAndIsAdmin')

const typeTransformMap = {
	article : transformArticleResponse,
	gif : transformGifResponse
}


const router = express.Router()

// GET REQUESTS

// GET ALL ARTICLES

const fetchPosts = catchAsync( async(req, res) => {
	const {isFlagged} = req.query
	const feed = await postService.fetchPosts(isFlagged)

	res.status(200).json({
		status: 'success',
		data: feed.map(({userId, ...post}) => ({
			...typeTransformMap[post.type](post),
			user :({
				userId ,
				fullName: `${post.firstName} ${post.lastName}`,
				profilePictureUrl : post.profilePictureUrl,
				email : post.email
			})})
		)
	})
	
})


// Routes

// isAuthenticated middle to protect all posts related requests
router.use(isAuthenticated())

router
	.route('/')
	.get( validateSchema(fetchPostsSchema), isFlaggedAndIsAdmin, fetchPosts)

module.exports = router
