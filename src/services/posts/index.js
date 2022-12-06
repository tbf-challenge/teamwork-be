const db = require("../../db")

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


const deletePostTags = async({postId, tagId}) => {
	const result = await db.query(
		'DELETE FROM posts_tags WHERE "postId" = $1 AND "tagId" = $2',
		[postId, tagId]
	)
	return result
}
const queryPostTags = async({tag}) => {
	const feed = await db.query(
		`SELECT * FROM posts 
		p INNER JOIN posts_tags pt 
		ON p.id=pt."postId" 
		WHERE "tagId"=$1`,
		[tag]
	)
	return feed.rows
}


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