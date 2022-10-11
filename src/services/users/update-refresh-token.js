const db = require("../../db")

const updateRefreshToken = async(refreshToken , id) => {
	const data = await db.query(
		`UPDATE users
   SET "refreshToken" = $1 
   WHERE id = $2 
   RETURNING *`,
		[refreshToken , id]
	)
	return data.rows[0]
}
module.exports = updateRefreshToken