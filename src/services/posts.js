const db = require("../db")
const {ArticleDoesNotExistError,
	 ArticleDoesNotExistForCommentError} = require("./errors")


const createPost = async({userId, title, image, content, published}) => {
	const newPost = await db.query(
		// eslint-disable-next-line max-len
		'INSERT INTO posts ("userId", title , image , content , published ) VALUES ($1 , $2 , $3 , $4 , $5 ) RETURNING *',
		[userId, title, image, content, published]
	)
	return newPost.rows[0]
}


const createComment = async({id, userId, comment}) => {
	const result = await db.query('SELECT * FROM posts WHERE id = $1', [id])
	const post = result.rows[0]
	if (!post) {
		const errorMessage = ArticleDoesNotExistForCommentError.message
		const err =  Error(errorMessage)
		err.name = ArticleDoesNotExistForCommentError.name
		throw err
	}
	
	const queryResult = await db.query(
		`INSERT INTO comments ("userId" , "postId" , content)
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
		const errorMessage = ArticleDoesNotExistError.message
		const err =  Error(errorMessage)
		err.name = ArticleDoesNotExistError.name
		throw err
	}
	return post
}


const updatePost = async({title, content, image, published, id}) => {
	const result = await db.query(
		// eslint-disable-next-line max-len
		'UPDATE posts SET title = $1, content = $2 , image = $3 , published = $4 WHERE id = $5 RETURNING *',
		[title, content, image, published, id]
	)
	const updatedPost = result.rows[0]
	if (!updatedPost) {
		const errorMessage = ArticleDoesNotExistError.message
		const err =  Error(errorMessage)
		err.name = ArticleDoesNotExistError.name
		throw err
	}
	
	return updatedPost

}

module.exports = {
	createPost,
	getPost,
	createComment,
	updatePost
}