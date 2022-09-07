const db = require("../db")
const {ArticleDoesNotExistError,
	 ArticleDoesNotExistForCommentError,
	  TagAlreadyAssignedToPostError
} = require("./errors")
const customError = require("../lib/custom-error")


const createPost = async({userId, title, image, content, published}) => {
	const newPost = await db.query(
		`INSERT INTO posts
		 ("userId", title , image , content , published )
		  VALUES ($1 , $2 , $3 , $4 , $5 ) 
		  RETURNING *`,
		[userId, title, image, content, published]
	)
	return newPost.rows[0]
}


const createComment = async({id, userId, comment}) => {
	const result = await db.query('SELECT * FROM posts WHERE id = $1', [id])
	const post = result.rows[0]
	if (!post) {
		throw customError(ArticleDoesNotExistForCommentError)
	}
	
	const queryResult = await db.query(
		`INSERT INTO comments 
		("userId" , "postId" , content)
	 	VALUES ($1 , $2 ,$3) RETURNING *`,
		[userId, id, comment]
	)
	const insertedComment = queryResult.rows[0]
	return {post , insertedComment}
}

const getPost = async({id}) => {
	const result = await db.query(
		`SELECT p.*, jsonb_agg(c.* ORDER BY c."createdAt" DESC) as comments
	FROM posts p 
	LEFT JOIN comments c ON p.id = c."postId"
	WHERE p.id=$1 
	GROUP BY p.id;`,
		[id]
	)
	const post = result.rows[0]
	if (!post) {
		throw customError(ArticleDoesNotExistError)
	}
	return post
}

const deletePost = async({id}) => {
	const result = await db.query('DELETE FROM posts WHERE id = $1', [id])
	return result
}

const updatePost = async({title, content, image, published, id}) => {
	const result = await db.query(
		`UPDATE posts 
		SET title = $1, content = $2 , image = $3 , published = $4
		 WHERE id = $5 
		 RETURNING *`,
		[title, content, image, published, id]
	)
	const updatedPost = result.rows[0]
	if (!updatedPost) {
		throw customError(ArticleDoesNotExistError)
	}
	
	return updatedPost

}
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
		SELECT $1,$2 WHERE NOT EXISTS 
		(SELECT * FROM posts_tags WHERE "postId" = $1 AND "tagId" = $2) 
		RETURNING *`,
		[postId, tagId]
	)
	const postsTags = result.rows[0]
	if (!postsTags) {
		throw customError(TagAlreadyAssignedToPostError)
	}
	return postsTags
}

const fetchPost = async() => {
	const feed = await db.query('SELECT * FROM posts')

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
	fetchPost
}