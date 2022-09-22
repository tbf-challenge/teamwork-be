const db = require("../../db")

const deletePost = async({id, type}) => {
	const result = await db.query(
		`DELETE FROM posts 
		WHERE id = $1
		AND type = $2 `,
		 [id, type])
	return result
}
module.exports = deletePost