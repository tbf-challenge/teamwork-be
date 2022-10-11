const db = require("../../db")
const customError = require("../../lib/custom-error")
const { UserNotFoundError } = require("../errors")


const updateUser = async ({
	id,
	firstName,
	lastName,
	gender,
	jobRole,
	department,
	address, 
	profilePictureUrl
}) => {

	const { rows:user } = await db.query(
		`SELECT * FROM users WHERE id = $1`, [id])
	const userDefault = user[0]

	if(!userDefault) {
		throw customError(UserNotFoundError)
	}
	

	const newFirstName = firstName || userDefault.firstName
	const newLastName = lastName || userDefault.lastName
	const newGender = gender || userDefault.gender
	const newJobRole = jobRole || userDefault.jobRole
	const newDepartment = department || userDefault.department
	const newAddress = address || userDefault.address
	const newProfilePictureUrl = 
		profilePictureUrl || userDefault.profilePictureUrl


	const { rows } = await db.query(
		`UPDATE users SET "firstName" = $1, "lastName" = $2, 
        "gender" = $3, "jobRole" = $4, "department" = $5,
        "address" = $6, "profilePictureUrl" = $7 WHERE id = $8 
		RETURNING id, "firstName", "lastName", 
        "email", "gender", "jobRole", "department", "address", "refreshToken",
			"profilePictureUrl"`,
		[newFirstName, newLastName, newGender, newJobRole, 
			newDepartment, newAddress, newProfilePictureUrl, id]
	)
	const userUpdated = rows[0]
	
	return userUpdated
}

module.exports = updateUser