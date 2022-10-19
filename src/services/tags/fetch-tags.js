const db = require('../../db')

/**
 * fetch all tags
 */
const fetchTags = async () => {

	const tags = await db.query("SELECT * FROM tags")
	const allTags = tags.rows
	return allTags
}

module.exports = fetchTags