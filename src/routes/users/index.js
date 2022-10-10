const express = require("express")
const db = require("../../db")
const isAuthenticated = require("../../middleware/isAuthenticated")
const userSevice = require('../../services/users')
const validateSchema = require('../../middleware/validateSchema')
const {
	updateUserSchema
} = require("../../schema")
const { catchAsync, AppError } = require("../../lib")
const { UserNotFoundError } = require("../../services/errors")

const ERROR_MAP = {
	[ UserNotFoundError.name ] : 404
}

const transformUserResponse = (userDetails) => ({
	...userDetails }
)

const router = express.Router()

const fetchUsers = (req, res) => {
	res.send("get users")
}
const createUsers = () => {}
const getUser = async (req, res) => {
	const { id } = req.params
	const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id])
	res.send(rows[0])
}
const updateUser = catchAsync(async (req, res ) => {
	const {
		firstName,
		lastName,
		email,
		gender,
		jobRole,
		department,
		address,
		profilePictureUrl
	} = req.body

	const { id } = req.params

	const userDetails = await userSevice.updateUser({
		id,
		firstName,
		lastName,
		email,
		gender,
		jobRole,
		department,
		address, 
		profilePictureUrl
	})

	res.status(200).json({
		status: "success",
		data: transformUserResponse(userDetails)
	})
})
const deleteUser = () => {}

// isAuthenticated middle to protect all posts related requests
router.use(isAuthenticated())

router
	.route("/")
	.get(fetchUsers)
	.post(createUsers)
router
	.route("/:id")
	.get(getUser)
	.patch(validateSchema(updateUserSchema), updateUser)
	.delete(deleteUser)

router
	.use((err, req, res, next)=> {
		const error = err
		error.success = false
		if(ERROR_MAP[error.name] ){
			next(new AppError( error.message ,ERROR_MAP[error.name] ))
		
		} 
		next(err)
	})

module.exports = router
