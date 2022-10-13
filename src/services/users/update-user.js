const db = require("../../db")
const customError = require("../../lib/custom-error")
const { UserNotFoundError } = require("../errors")

/**
 * 
 * @param {Number} id - id of the user to be updated
 * @param {Object} cols - columns to be updated
 * @returns {String} - query to be executed
 */
const constructQuery = (cols) => {

	// Setup static beginning of query
	const query = ['UPDATE users']
	query.push('SET')
	// Create another array storing each set command
	// and assigning a number value for parameterized query
	const set = []
	Object.keys(cols).forEach((key, i) => {
	  set.push(`"${key}" = ($${(i + 1)})`) 
	})
	
	query.push(set.join(', '))
  
	// Add the WHERE statement to look up by id
	
	query.push(`WHERE "id" = ($${set.length + 1}) RETURNING *` )
  
	// Return a complete query string
	return query.join(' ')
}

/**
 * 
 * @param {Number} id - id of the user to be updated
 * @param {Object} requestBody - request body
 * @returns {Object} - updated user
 */
const updateUser = async (id,
	data
) => {

	const query = constructQuery(data)	

	const colValues = Object.values(
		data
	)

	colValues.push(id)

	const { rows } = await db.query(
		query, colValues)

	const updatedUser = rows[0]


	if(!updatedUser) {
		throw customError(UserNotFoundError)
	}
	
	return updatedUser
}

module.exports = updateUser