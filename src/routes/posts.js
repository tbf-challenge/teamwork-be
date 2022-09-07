const express = require('express')
const { logger } = require('../lib')
const isAuthenticated = require('../middleware/isAuthenticated')

const postService = require('../services/posts')
const {
	FeedDoesNotExistError
} = require("../services/errors")

const log = logger()
const router = express.Router()
const ERROR_MAP = {
	[FeedDoesNotExistError.name] : 422 
}

// GET REQUESTS

// GET ALL ARTICLES

const fetchPosts = async (req, res, next) => {
	try {
		const feed = await postService.fetchPost({})

		res.status(200).json({
			status: 'success',
			data: feed.map((article) => ({
				id: article.id,
				userId: article.userId,
				title: article.title,
				content: article.content,
				image: article.image,
				published: article.published,
				createdOn: article.createdAt
			}))
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
