const express = require('express')
const passport = require('passport')
const {createPost} = require('../services/posts')
const { logger } = require('../lib')

const log = logger()
const router = express.Router()

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
				userId: newArticle.userId,
				title: newArticle.title,
				image: newArticle.image,
				article: newArticle.content,
				published: newArticle.published,
				createdOn: newArticle.createdAt,
				articleId: newArticle.id
			}
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// ROUTES

router
	.route('/')
	.post(passport.authenticate('jwt', {session: false }), createArticle)


module.exports = router