const db = require('../../db')
/**
 * Delete a tag
 * @param {number} tagId - The id of the tag
 */
const deleteTag = tagId => 
	db.query("DELETE FROM tags WHERE id = $1", [tagId])
 
module.exports = deleteTag