const deletePost = require("./delete-post")
const createComment = require("./create-comment")
const likePost = require("./like-post")
const unlikePost = require("./unlike-post")
const flagPost = require("./flag-post")
const unflagPost = require("./unflag-post")
const createPost = require("./create-post")
const updatePost = require("./update-post")
const getPost = require("./get-post")
const fetchPosts = require("./fetch-posts")
const assignTagToPost = require("./assign-tag-to-post")
const deletePostTags = require("./delete-post-tag")
const queryPostTags = require("./query-post-tags")


module.exports = {
	createPost,
	getPost,
	createComment,
	deletePost,
	updatePost,
	deletePostTags,
	queryPostTags,
	assignTagToPost,
	fetchPosts,
	likePost,
	unlikePost,
	flagPost,
	unflagPost

}