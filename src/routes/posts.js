const express = require('express')

const db = require('../db')
const { logger } = require('../lib')
const isAuthenticated = require('../middleware/isAuthenticated')

const log = logger()
const router = express.Router()

// GET REQUESTS

// GET ALL ARTICLES

const fetchPosts = async (req, res, next) => {
	try {
		const feed = await db.query('SELECT * FROM posts')
		const allArticles = feed.rows

		res.status(200).json({
			status: 'success',
			data: allArticles.map((article) => ({
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

module.exports = router
