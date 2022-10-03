const db = require("../../db")
const {
	GifHasAlreadyBeenFlaggedError
} = require("../errors")
const customError = require("../../lib/custom-error")

const uniqueErrorCode = '23505'

const flagPost = async({userId, postId, reason}) => {
	const result = await db.query(
		`INSERT INTO post_flags
		 ("userId", "postId", reason)
		  VALUES ($1 , $2, $3 ) 
		  RETURNING *`,
		[userId, postId, reason]
	).catch(error => {
		if(error.code === uniqueErrorCode ){
			throw customError(GifHasAlreadyBeenFlaggedError)
		}
		else{
			throw error
		}
	})
	return result.rows[0]
}

module.exports = flagPost