const db = require("../../db")
const {
	GifHasAlreadyBeenFlaggedError,
	ArticleHasAlreadyBeenFlaggedError
} = require("../errors")
const customError = require("../../lib/custom-error")

const uniqueErrorCode = '23505'

const flagPost = async({userId, postId, reason, type}) => {
	const result = await db.query(
		`INSERT INTO post_flags
		 ("userId", "postId", reason)
		  VALUES ($1 , $2, $3 ) 
		  RETURNING "userId", "postId", reason, "createdAt"`,
		[userId, postId, reason]
	).catch(error => {
		if(error.code === uniqueErrorCode ){
			throw customError(
				type === 'gif' ?
					GifHasAlreadyBeenFlaggedError
					: ArticleHasAlreadyBeenFlaggedError )
		}
		else{
			throw error
		}
	})

	/* There is a trigger on the post_flags table that computes and updates 
	the flagsCount column in the posts table on every insert */
	return result.rows[0]
}

module.exports = flagPost