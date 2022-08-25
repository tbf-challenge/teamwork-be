const express = require('express')
const {createPost , getPost } = require('../services/posts')
const { logger } = require('../lib')
const isAuthenticated = require('../middleware/isAuthenticated')

const log = logger()
const router = express.Router()

const transformArticleResponse = (article) => ({
	userId: article.userId,
	title: article.title,
	image: article.image,
	article: article.content,
	published: article.published,
	createdOn: article.createdAt,
	articleId: article.id
})

// POST REQUESTS

//  CREATE ARTICLE ENDPOINT

const createArticle = async (req, res, next) => {
	try {
		const userId = req.user.id
		const { title, image, article, published } = req.body
		const newArticle = await createPost({
			userId,
			title, 
			image, 
			content : article,
			published})
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

// GET POST BY ID
const getArticle = async (req, res, next) => {
	const { id } = req.params
	try {
		const article = await getPost({
			id
		})
		if (!article) {
			return res.status(404).json({
				success: false,
				message: 'Article does not exist'
			})
		}
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

// ROUTES
router.use(isAuthenticated())
router
	.route('/')
	.post( createArticle)
router
	.route('/:id')
	.get(getArticle)
module.exports = router