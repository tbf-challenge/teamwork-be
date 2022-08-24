const tagRouter = require("express").Router()
const db = require("../db")
const { logger } = require("../lib")
const isAuthenticated = require("../middleware/isAuthenticated")

const log = logger()

// FETCH ALL PREDEFINED TAGS

const fetchTags = async (_req, res, next) => {
	try {
		const tags = await db.query("SELECT * FROM tags")
		res.status(200).json({
			status: "success",
			data: tags.rows.map((tag) => ({
				id: tag.id,
				title: tag.title,
				content: tag.content
			}))
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// CREATE NEW TAG

const createTag = async (req, res, next) => {
	try {
		const { content, title } = req.body

		const newTag = await db.query(
			// eslint-disable-next-line max-len
			"INSERT INTO tags (content, title) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM tags WHERE title = $2) RETURNING *",
			[content, title]
		)

		if (!newTag.rows[0]) {
			res.status(400).json({
				status: "error",
				data: { message: "Tag already exists" }
			})
		} else {
			res.status(201).json({
				status: "success",
				data: {
					id: newTag.rows[0].id,
					title: newTag.rows[0].title,
					content: newTag.rows[0].content
				}
			})
		}
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// UPDATE TAG

const updateTag = async (req, res, next) => {
	try {
		const { tagId } = req.params
		const { content, title } = req.body

		const updatedTag = await db.query(
			// eslint-disable-next-line max-len
			"UPDATE tags SET content = $1, title = $2 WHERE id = $3 RETURNING *",
			[content, title, tagId]
		)

		res.status(200).json({
			status: "success",
			data: {
				id: updatedTag.rows[0].id,
				title: updatedTag.rows[0].title,
				content: updatedTag.rows[0].content
			}
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// DELETE TAG

const deleteTag = async (req, res, next) => {
	try {
		const { tagId } = req.params

		await db.query("DELETE FROM tags WHERE id = $1", [tagId])

		res.status(200).json({
			status: "success",
			data: { message: "Tag has been successfully deleted" }
		})
	} catch (err) {
		log.error(err.message)
		next(err)
	}
}

// isAuthenticated middle to protect all posts related requests
tagRouter.use(isAuthenticated())

tagRouter
	.route("/")
	.get(fetchTags)
	.post(createTag)
tagRouter
	.route("/:tagId")
	.patch(updateTag)
	.delete(deleteTag)

module.exports = tagRouter
