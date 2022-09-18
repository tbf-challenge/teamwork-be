const db = require("../../db")

const updateRefreshToken = (refreshToken , id) => db.query(
	`UPDATE users
   SET "refreshToken" = $1 
   WHERE id = $2 `,
	[refreshToken , id]
)

module.exports = updateRefreshToken