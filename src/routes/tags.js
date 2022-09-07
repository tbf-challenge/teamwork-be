const tagRouter = require("express").Router()
const isAuthenticated = require("../middleware/isAuthenticated")
const { tagController } = require('../controllers')
const validateSchema = require('../middleware/validateSchema')

const {
	createTagSchema
} = require('../schema')
// isAuthenticated middle to protect all posts related requests
tagRouter.use(isAuthenticated())

tagRouter
	.route("/")
	.get(tagController.fetchTags)
	.post( validateSchema(createTagSchema), tagController.createNewTag)
tagRouter
	.route("/:tagId")
	.patch(tagController.updateTag)
	.delete(tagController.deleteTag)

tagRouter.use(tagController.tagErrorMiddleware)

module.exports = tagRouter
