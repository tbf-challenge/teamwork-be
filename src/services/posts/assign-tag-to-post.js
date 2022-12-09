const db = require("../../db")
const {
	TagAlreadyAssignedToPostError
} = require("../errors")
const customError = require("../../lib/custom-error")

const uniqueErrorCode = '23505'

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

module.exports = assignTagToPost