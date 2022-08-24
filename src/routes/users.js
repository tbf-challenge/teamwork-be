const express = require("express")
const db = require("../db")
const isAuthenticated = require("../middleware/isAuthenticated")

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
const updateUser = () => {}
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
	.patch(updateUser)
	.delete(deleteUser)

module.exports = router
