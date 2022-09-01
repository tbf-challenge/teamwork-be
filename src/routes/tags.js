const tagRouter = require("express").Router()
const isAuthenticated = require("../middleware/isAuthenticated")
const { tagController } = require('../controllers')

// isAuthenticated middle to protect all posts related requests
tagRouter.use(isAuthenticated())

tagRouter
	.route("/")
	.get(tagController.fetchTags)
	.post(tagController.createNewTag)
tagRouter
	.route("/:tagId")
	.patch(tagController.updateTag)
	.delete(tagController.deleteTag)

module.exports = tagRouter
