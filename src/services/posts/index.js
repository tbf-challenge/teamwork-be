const db = require("../../db")
const {
	TagAlreadyAssignedToPostError
} = require("../errors")
const customError = require("../../lib/custom-error")
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


const uniqueErrorCode = '23505'


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
const assignTagToPost = async({postId , tagId}) => {
	const result = await db.query(
		`INSERT INTO posts_tags ("postId","tagId") 
		VALUES ($1,$2) 
		RETURNING *`,
		[postId, tagId]
	).catch(error => {
		if(error.code === uniqueErrorCode ){
			throw customError(TagAlreadyAssignedToPostError)
		}
		else{
			throw error
		}
	})
	
	return result.rows[0]
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