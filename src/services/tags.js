const db = require("../db")

//	CREATE TAG ENDPOINT
const createTag = async ({ content, title }) => {
	const newTag = await db.query(
		// eslint-disable-next-line max-len
		"INSERT INTO tags (content, title) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM tags WHERE title = $2) RETURNING *",
		[content, title]
	)

	return newTag.rows[0]
}

// FETCH ALL TAGS
const fetchTags = async () => {

	const tags = await db.query("SELECT * FROM tags")
	const allTags = tags.rows
	return allTags
}

// UPDATE TAGS
const updateTag = async (title, content, tagId) => {

	const result = await db.query(
		// eslint-disable-next-line max-len
		"UPDATE tags SET content = $1, title = $2 WHERE id = $3 RETURNING *",
		[content, title, tagId]
	)
	const updatedTag = result.rows[0]
	return updatedTag

}

// DELETE TAG
const deleteTag = async (tagId) => {

	await db.query("DELETE FROM tags WHERE id = $1", [tagId])
	return {
		status: "success"
	}
}

module.exports = {
	createTag,
	fetchTags,
	updateTag,
	deleteTag
}