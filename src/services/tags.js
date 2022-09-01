const db = require("../db")

/**
 * Create a tag
 * @contructor
 * @param {object} object containing the object and title
 */
const createTag = async ({ content, title }) => {
	const newTag = await db.query(
		// eslint-disable-next-line max-len
		"INSERT INTO tags (content, title) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM tags WHERE title = $2) RETURNING *",
		[content, title]
	)

	return newTag.rows[0]
}

/**
 * fetch all tags
 * @contructor
 */
const fetchTags = async () => {

	const tags = await db.query("SELECT * FROM tags")
	const allTags = tags.rows
	return allTags
}

/**
 * Update a tag
 * @contructor
 * @param {string} title - Tag title
 * @param {string} content - Tag content
 * @param {number} tagId - The id of the tag
 */
const updateTag = async (title, content, tagId) => {

	const result = await db.query(
		// eslint-disable-next-line max-len
		"UPDATE tags SET content = $1, title = $2 WHERE id = $3 RETURNING *",
		[content, title, tagId]
	)
	const updatedTag = result.rows[0]
	return updatedTag

}

/**
 * Delete a tag
 * @contructor
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