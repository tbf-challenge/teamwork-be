const db = require('../db')

const fetchUsers = async() => {

	const users = await db.query('SELECT * FROM users')
	return users.rows
}

module.exports = {
	fetchUsers
}