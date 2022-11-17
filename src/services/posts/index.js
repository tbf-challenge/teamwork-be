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

const fetchPosts = async() => {
	const feed = await db.query(`
	SELECT posts.id, posts."userId" , posts.title, posts.image, posts.content,
	posts.published, posts."createdAt", posts.type, posts."likesCount",
	users."firstName", users."lastName", users.email, users."profilePictureUrl" 
	FROM posts
	INNER JOIN users on posts."userId" = users.id;
	`)

	return feed.rows

}

const fetchFlaggedPosts = async() => {
	const feed = await db.query(`
	SELECT posts.id, posts."userId" , posts.title, posts.image, posts.content,
	posts.published, posts."createdAt", posts.type, posts."likesCount",
	posts."flagsCount",
	users."firstName", users."lastName", users.email, users."profilePictureUrl" 
	FROM posts
	INNER JOIN users on posts."userId" = users.id
	WHERE posts."flagsCount" > 0;
	`)

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
	unflagPost,
	fetchFlaggedPosts

}