const express = require('express')
const isAuthenticated = require('../middleware/isAuthenticated')
const { catchAsync} = require('../lib')
const postService = require('../services/posts')
const validateSchema = require('../middleware/validateSchema')
const isAdmin = require("../middleware/isAdmin")
const {
	transformArticleResponse ,
	transformGifResponse
} = require('./common/transformers')
const { fetchPostsSchema } = require('../schema')

const typeTransformMap = {
	article : transformArticleResponse,
	gif : transformGifResponse
}


const router = express.Router()

// GET REQUESTS

// GET ALL ARTICLES

const fetchPosts = catchAsync( async(req, res) => {
	
	const {feed, count} = await postService.fetchPosts(req.query)
	
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
		),
		metadata: {
			totalCount: count
		   }
	})
	
})


// Routes

// isAuthenticated middle to protect all posts related requests
router.use(isAuthenticated())

router
	.route('/')
	.get(
		(req, res, next) => {
			if (req.query.isFlagged !== undefined) {
				return	isAdmin(req, res, next)
			   } 
			   return next()
	  },validateSchema(fetchPostsSchema), fetchPosts )
	  

module.exports = router
