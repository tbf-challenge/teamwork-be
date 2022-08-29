const express = require('express')

const isAuthenticated = require('../middleware/isAuthenticated')
const { postController } = require('../controllers')

const router = express.Router()

// Routes

// isAuthenticated middle to protect all posts related requests
router.use(isAuthenticated())

router
	.route('/')
	.get(postController.fetchPosts)
router
	.route('/query')
	.get(postController.queryPosts)
router
	.route('/:postId/tags')
	.post(postController.assignTagToPost)
router
	.route('/:postId/tags/:tagId')
	.delete(postController.deletePostTags)
router
	.route('/:id')
	.delete(postController.deletePost)
	.patch(postController.updatePost)

module.exports = router
