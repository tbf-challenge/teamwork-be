const express = require("express")
const db = require("../../db")
const isAuthenticated = require("../../middleware/isAuthenticated")
const userService = require('../../services/users')
const validateSchema = require('../../middleware/validateSchema')
const isAdmin = require('../../middleware/isAdmin')
const {
	updateUserSchema
} = require("../../schema")
const { catchAsync, AppError } = require("../../lib")
const { UserNotFoundError } = require("../../services/errors")
const { transformUserResponse }= require("../common/transformers")

const ERROR_MAP = {
	[ UserNotFoundError.name ] : 404
}


const router = express.Router()

const fetchUsers =  catchAsync( async(req, res) => {
	const users = await userService.fetchUsers()

	res.status(200).json({
		status: 'success',
		data: users.map(transformUserResponse)
	})
	
})
const createUsers = () => {}
const getUser = async (req, res) => {
	const { id } = req.params
	const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id])
	res.send(rows[0])
}
const updateUser = catchAsync(async (req, res ) => {
	
	const { id } = req.params


	const userDetails = await userService.updateUser(id, req.body)

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
	.get(isAdmin, fetchUsers)
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
