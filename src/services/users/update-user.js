const db = require("../../db")
const customError = require("../../lib/custom-error")
const { UserNotFoundError } = require("../errors")

/**
 * 
 * @param {Number} id - id of the user to be updated
 * @param {Object} cols - columns to be updated
 * @returns {String} - query to be executed
 */
const constructQuery = (id, cols) => {

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
	query.push(`WHERE id = ${id} RETURNING  "id",
	"firstName", "lastName", "email",
	"gender", "jobRole", "department", 
	"address", "refreshToken", "profilePictureUrl"` )
  
	// Return a complete query string
	return query.join(' ')
}

/**
 * 
 * @param {Number} id - id of the user to be updated
 * @param {*} requestBody - reqquest body
 * @returns {Object} - updated user
 */
const updateUser = async (id,
	requestBody
) => {

	const query = constructQuery(id, requestBody)

	const colValues = Object.keys(
		requestBody
	).map(key => requestBody[key])

	const { rows } = await db.query(
		query, colValues)

	const userUpdated = rows[0]


	if(!userUpdated) {
		throw customError(UserNotFoundError)
	}
	
	return userUpdated
}

module.exports = updateUser