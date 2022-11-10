const db = require("../../db")
const { TagAlreadyExistsError } = require("../errors")
const customError = require("../../lib/custom-error")


const uniqueErrorCode = '23505'
/**
 * Create a tag
 * @param {object} object containing the content and title
 */
const createTag = async ({ content, title }) => {
	const newTag = await db.query(
		`INSERT INTO tags (content, title) 
		VALUES ($1,$2) 
		RETURNING *`,
		[content, title]
	).catch(error => {
		if(error.code === uniqueErrorCode ){
			throw customError(TagAlreadyExistsError)
		}
		else{
			throw error
		}
	})

	return newTag.rows[0]
}

module.exports = createTag