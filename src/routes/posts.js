const express = require('express')
const { logger } = require('../lib')
const isAuthenticated = require('../middleware/isAuthenticated')

const postService = require('../services/posts')
const {
	transformArticleResponse ,
	transformGifResponse
} = require('./common/transformers')

const log = logger()
const router = express.Router()


// GET REQUESTS

// GET ALL ARTICLES

const fetchPosts = async (req, res, next) => {
	try {
		const feed = await postService.fetchPosts()

		res.status(200).json({
			status: 'success',
			data: feed.map((post) => {
				if(post.type === 'article')
					return {
						...transformArticleResponse(post)
					}
				return {
					...transformGifResponse(post)
				}})
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// Routes

// isAuthenticated middle to protect all posts related requests
router.use(isAuthenticated())

router
	.route('/')
	.get(fetchPosts)

module.exports = router
