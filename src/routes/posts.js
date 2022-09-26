const express = require('express')
const { logger } = require('../lib')
const isAuthenticated = require('../middleware/isAuthenticated')

const postService = require('../services/posts')

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
						id: post.id,
						userId: post.userId,
						title: post.title,
						article: post.content,
						image: post.image,
						published: post.published,
						createdOn: post.createdAt
					}
				return {
					id: post.id,
					userId: post.userId,
					title: post.title,
					gif: post.content,
					published: post.published,
					createdOn: post.createdAt
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
