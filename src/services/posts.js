const db = require("../db")
const {ArticleDoesNotExistError} = require("./errors")

//	CREATE ARTICLE ENDPOINT
const createPost = async({userId, title, image, content, published}) => {
	const newPost = await db.query(
		// eslint-disable-next-line max-len
		'INSERT INTO posts ("userId", title , image , content , published ) VALUES ($1 , $2 , $3 , $4 , $5 ) RETURNING *',
		[userId, title, image, content, published]
	)
	return newPost.rows[0]
}

// CREATE ARTICLE COMMENT

const createComment = async({id, userId, comment}) => {
	const result = await db.query('SELECT * FROM posts WHERE id = $1', [id])
	const post = result.rows[0]
	if (!post) {
		const errorMessage = ArticleDoesNotExistError.message
		const err =  Error(errorMessage)
		err.name = ArticleDoesNotExistError.name
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
// GET ARTICLE BY ID ENDPOINT
const getPost = async({id}) => {
	const post = await db.query(
		`SELECT p.*, jsonb_agg(c.* ORDER BY c."createdAt" DESC) as comments
	FROM posts p 
	LEFT JOIN comments c ON p.id = c."postId"
	WHERE p.id=$1 
	GROUP BY p.id;`,
		[id]
	)
	return post.rows[0]
}


module.exports = {
	createPost,
	getPost,
	createComment
}