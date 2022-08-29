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
				createdAt: article.createdAt
			}))
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// ASSIGN TAG TO AN ARTICLE

const assignTagToPost = async (req, res, next) => {
	try {
		const { postId } = req.params // post id;
		const { tagId } = req.body

		const postsTags = await db.query(
			// eslint-disable-next-line max-len
			'INSERT INTO posts_tags ("postId","tagId") SELECT $1,$2 WHERE NOT EXISTS (SELECT * FROM posts_tags WHERE "postId" = $1 AND "tagId" = $2) RETURNING *',
			[postId, tagId]
		)

		if (!postsTags.rows[0]) {
			res.status(400).json({
				status: 'error',
				data: {
					message: 'Tag is already assigned to the post'
				}
			})
		} else {
			res.status(200).json({
				status: 'success',
				data: {
					postId: postsTags.rows[0].postId,
					tagId: postsTags.rows[0].tagId
				}
			})
		}
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// GET ALL ARTICLES WITH SAME TAG

const queryPosts = async (req, res, next) => {
	try {
		const { tag } = req.query
		const feed = await db.query(
			// eslint-disable-next-line max-len
			'SELECT * FROM posts p INNER JOIN posts_tags pt ON p.id=pt."postId" WHERE "tagId"=$1',
			[tag]
		)
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
				createdAt: article.createdAt
			}))
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// DELETE REQUESTS

// DELETE AN ARTICLE
const deletePost = async (req, res, next) => {
	const { id } = req.params

	try {
		await db.query('DELETE FROM posts WHERE id = $1', [id])

		res.status(200).json({
			status: 'success',
			data: {
				message: 'Article was successfully deleted'
			}
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// DELETE TAGS IN AN ARTICLE

const deletePostTags = async (req, res, next) => {
	try {
		const { postId, tagId } = req.params

		await db.query(
			'DELETE FROM posts_tags WHERE "postId" = $1 AND "tagId" = $2',
			[postId, tagId]
		)

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


// Routes

// isAuthenticated middle to protect all posts related requests
router.use(isAuthenticated())

router
	.route('/')
	.get(fetchPosts)
router
	.route('/query')
	.get(queryPosts)
router
	.route('/:postId/tags')
	.post(assignTagToPost)
router
	.route('/:postId/tags/:tagId')
	.delete(deletePostTags)
router
	.route('/:id')
	.delete(deletePost)

module.exports = router
