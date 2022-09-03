const db = require("../db")
const { TagDoesNotExistError, TagAlreadyExistsError } = require("./errors")
const customError = require("../lib/custom-error")

/**
 * Create a tag
 * @param {object} object containing the content and title
 */
const createTag = async ({ content, title }) => {
	const result = await db.query(
		`INSERT INTO tags (content, title) 
		SELECT $1, $2 
		WHERE NOT EXISTS 
		(SELECT * FROM tags WHERE title = $2) 
		RETURNING *`,
		[content, title]
	)
	const newTag =  result.rows[0]
	if (!newTag){
		throw customError(TagAlreadyExistsError)
	}

	return newTag
}

/**
 * fetch all tags
 */
const fetchTags = async () => {

	const tags = await db.query("SELECT * FROM tags")
	const allTags = tags.rows
	return allTags
}

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

/**
 * Delete a tag
 * @param {number} tagId - The id of the tag
 */
const deleteTag = tagId => 
	db.query("DELETE FROM tags WHERE id = $1", [tagId])
	
module.exports = {
	createTag,
	fetchTags,
	updateTag,
	deleteTag
}