const db = require("../../db")
const {
	GifHasAlreadyBeenLikedError,
	ArticleHasAlreadyBeenLikedError
} = require("../errors")
const customError = require("../../lib/custom-error")

const uniqueErrorCode = '23505'

const likePost = async({userId, postId, type}) => {
	const newLike = await db.query(
		`INSERT INTO post_likes
		 ("userId", "postId")
		  VALUES ($1 , $2 ) 
		  RETURNING "userId", "postId", "createdAt"`,
		[userId, postId]
	).catch(error => {
		if(error.code === uniqueErrorCode ){
			throw customError(
				type === "gif" ?
					GifHasAlreadyBeenLikedError :
					ArticleHasAlreadyBeenLikedError)
		}
		else{
			throw error
		}
	})
	
	/* There is a trigger on the post_likes table that computes and updates 
	the likesCount column in the posts table on every insert */

	return newLike.rows[0]
}


module.exports = likePost