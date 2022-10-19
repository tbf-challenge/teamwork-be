const db = require("../../db")

const fetchUsers = async() => {
	const result = await db.query('SELECT * FROM users')

	return result.rows
}

module.exports = fetchUsers