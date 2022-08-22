const express = require("express")
const passport = require("passport")

const db = require("../db")
const { logger } = require("../lib")

const log = logger()
const router = express.Router()

// POST REQUESTS
const createPost = async (req, res, next) => {
	try {
		const userId = req.user.id
		const { title, image, content, published } = req.body
		const newArticle = await db.query(
			// eslint-disable-next-line max-len
			'INSERT INTO posts ("userId", title , image , content , published ) VALUES ($1 , $2 , $3 , $4 , $5 ) RETURNING *',
			[userId, title, image, content, published]
		)
		const articleBody = newArticle.rows[0]
		res.status(201).json({
			status: "success",
			data: {
				message: "Article successfully posted",
				id: articleBody.id,
				userId: articleBody.userId,
				title: articleBody.title,
				image: articleBody.image,
				content: articleBody.content,
				published: articleBody.published,
				createdAt: articleBody.createdAt
			}
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// GET POST BY ID
const getPost = async (req, res, next) => {
	const { id } = req.params
	try {
		const posts = await db.query(
			`SELECT p.*, jsonb_agg(c.* ORDER BY c."createdAt" DESC) as comments
            FROM posts p 
            LEFT JOIN comments c ON p.id = c."postId"
            WHERE p.id=$1 
            GROUP BY p.id;`,
			[id]
		)
		const article = posts.rows[0]

		if (!article) {
			return res.status(404).json({
				success: false,
				message: "Article does not exist"
			})
		}
		return res.status(200).json({
			status: "success",
			data: {
				id: article.id,
				createdAt: article.createdAt,
				title: article.title,
				image: article.image,
				published: article.published,
				comments: article.comments
					.filter((comment) => comment)
					.map((comment) => ({
						id: comment.id,
						comment: comment.comment,
						userId: comment.userId
					}))
			}
		})
	} catch (err) {
		log.error(err.message)
		return next(err)
	}
}

const fetchPosts = async (req, res, next) => {
	try {
		const feed = await db.query("SELECT * FROM posts")
		const allArticles = feed.rows

		res.status(200).json({
			status: "success",
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
				status: "error",
				data: {
					message: "Tag is already assigned to the post"
				}
			})
		} else {
			res.status(200).json({
				status: "success",
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
			status: "success",
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
		await db.query("DELETE FROM posts WHERE id = $1", [id])

		res.status(200).json({
			status: "success",
			data: {
				message: "Article was successfully deleted"
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
			status: "success",
			data: {
				message: "Tag has been removed from post"
			}
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// PATCH REQUESTS

// UPDATE AN ARTICLE
const updatePost = async (req, res) => {
	const { id } = req.params // WHERE
	const { title, content, image, published } = req.body // SET

	try {
		const result = await db.query(
			// eslint-disable-next-line max-len
			"UPDATE posts SET title = $1, content = $2 , image = $3 , published = $4 WHERE id = $5 RETURNING *",
			[title, content, image, published, id]
		)
		const updatedArticle = result.rows[0]

		if (!updatedArticle) {
			res.status(404).json({
				success: false,
				message: "Article does not exist"
			})
		} else {
			res.status(200).json({
				status: "success",
				data: {
					message: "Article successfully updated",
					title: updatedArticle.title,
					content: updatedArticle.content,
					image: updatedArticle.image,
					published: updatedArticle.published
				}
			})
		}
	} catch (err) {
		log.error(err.message)

		res.status(500).json({
			success: false,
			message: err.message
		})
	}
}
// Routes

router.route("/query").get(queryPosts)
router.route("/:postId/tags").post(assignTagToPost)
router.route("/:postId/tags/:tagId").delete(deletePostTags)

router
	.route("/")
	.post(
		passport.authenticate("jwt", {
			session: false
		}),
		createPost
	)
	.get(fetchPosts)
router
	.route("/:id")
	.delete(
		passport.authenticate("jwt", {
			session: false
		}),
		deletePost
	)
	.patch(
		passport.authenticate("jwt", {
			session: false
		}),
		updatePost
	)
	.get(getPost)

module.exports = router
