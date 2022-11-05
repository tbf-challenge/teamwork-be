const db = require("../../db")
const { TagDoesNotExistError} = require("../errors")
const customError = require("../../lib/custom-error")

/**
 * Update a tag
 * @param {string} title - Tag title
 * @param {string} content - Tag content
 * @param {number} tagId - The id of the tag
 */

const updateTag = async (title, content, tagId) => {

	const result = await db.query(
		`UPDATE tags 
		SET content = $1, title = $2
		 WHERE id = $3 RETURNING *`,
		[content, title, tagId]
	)
	const updatedTag = result.rows[0]
	
	if (!updatedTag){
		throw customError(TagDoesNotExistError)
	}
	return updatedTag
}

module.exports = updateTag