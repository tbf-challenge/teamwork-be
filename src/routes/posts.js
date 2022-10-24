const express = require('express')
const isAuthenticated = require('../middleware/isAuthenticated')
const { catchAsync} = require('../lib')
const postService = require('../services/posts')
const {
	transformArticleResponse ,
	transformGifResponse,
	transformUserResponse
} = require('./common/transformers')

const typeTransformMap = {
	article : transformArticleResponse,
	gif : transformGifResponse,
	user : transformUserResponse
}

const router = express.Router()


// GET REQUESTS

// GET ALL ARTICLES

const fetchPosts = catchAsync( async(req, res) => {

	const feed = await postService.fetchPosts()

	res.status(200).json({
		status: 'success',
		data: feed.map((post) => ({
			...typeTransformMap[post.type](post),
			user :({
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
	.get(fetchPosts)

module.exports = router
