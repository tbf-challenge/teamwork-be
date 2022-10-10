const db = require("../../db")
const customError = require("../../lib/custom-error")
const { UserNotFoundError } = require("../errors")


const updateUser = async ({
	id,
	firstName,
	lastName,
	email,
	gender,
	jobRole,
	department,
	address, 
	profilePictureUrl
}) => {
	const { rows } = await db.query(
		`UPDATE users SET "firstName" = $1, "lastName" = $2, 
        "email" = $3, "gender" = $4, "jobRole" = $5, "department" = $6,
        "address" = $7, "profilePictureUrl" = $8 WHERE id = $9 
		RETURNING id, "firstName", "lastName", 
        "email", "gender", "jobRole", "department", "address", "refreshToken",
			"profilePictureUrl"`,
		[firstName, lastName, email, gender, jobRole, 
			department, address, profilePictureUrl, id]
	)
	const user = rows[0]
	if(!user) {
		throw customError(UserNotFoundError)
	}

	return user
}

module.exports = updateUser