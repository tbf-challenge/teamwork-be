const db = require("../../db")
const {
	ArticleDoesNotExistForCommentError,
	GifDoesNotExistForCommentError
} = require("../errors")
const customError = require("../../lib/custom-error")

const createComment = async({id, userId, comment, type}) => {
	const result = await db.query(
		`SELECT * FROM posts 
	WHERE id = $1
	AND type = $2 `,
	 [id , type ])
	const post = result.rows[0]
	if (!post) {
		throw customError(
			type === 'article' ?
				ArticleDoesNotExistForCommentError :
				GifDoesNotExistForCommentError)
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

module.exports = createComment