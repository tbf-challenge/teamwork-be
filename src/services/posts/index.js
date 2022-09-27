const db = require("../../db")
const {
	ArticleDoesNotExistError,
	GifDoesNotExistError,
	TagAlreadyAssignedToPostError
} = require("../errors")
const customError = require("../../lib/custom-error")
const deletePost = require("./delete-post")
const createComment = require("./create-comment")
const recordPostLikes = require("./record-likes")

const uniqueErrorCode = '23505'

const createPost = async({userId, title, image, content, published, type}) => {
	const newPost = await db.query(
		`INSERT INTO posts
		 ("userId", title , image , content , published, type )
		  VALUES ($1 , $2 , $3 , $4 , $5, $6 ) 
		  RETURNING *`,
		[userId, title, image, content, published, type]
	)
	return newPost.rows[0]
}

const getPost = async({id, type}) => {
	const result = await db.query(
		`SELECT p.*, jsonb_agg(c.* ORDER BY c."createdAt" DESC) as comments
	FROM posts p 
	LEFT JOIN comments c ON p.id = c."postId"
	WHERE p.id=$1 AND p.type =$2
	GROUP BY p.id;`,
		[id, type]
	)
	const post = result.rows[0]
	if (!post) {
		throw customError(
			type === 'article' ?
				ArticleDoesNotExistError : GifDoesNotExistError)
	}
	return post
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
	fetchPosts,
	recordPostLikes
}