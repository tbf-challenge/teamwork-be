const express = require("express")
const { catchAsync } = require('../lib')

const db = require("../db")
const isAuthenticated = require("../middleware/isAuthenticated")
const userService = require('../services/users')

const router = express.Router()

const fetchUsers = catchAsync(async ( req, res ) => {

	const users = await userService.fetchUsers()

	return res.status(200).json({
		status: 'success',
		data: users.map(user => ({
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName
		}))
	})
})

const getUser = async (req, res) => {
	const { id } = req.params
	const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id])
	res.send(rows[0])
}
const updateUser = () => {}
const deleteUser = () => {}

// isAuthenticated middle to protect all posts related requests
router.use(isAuthenticated())

router
	.route("/")
	.get(fetchUsers)
router
	.route("/:id")
	.get(getUser)
	.patch(updateUser)
	.delete(deleteUser)

module.exports = router
