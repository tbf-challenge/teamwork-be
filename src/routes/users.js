const express = require('express')
const db = require('../db')

const router = express.Router()

const fetchUsers = (req, res) => {
    res.send('Hello')
}
const createUsers = () => {}
const getUser = async (req, res) => {
    const { id } = req.params
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id])
    res.send(rows[0])
}
const updateUser = () => {}
const deleteUser = () => {}

router.route('/').get(fetchUsers)
router.route('/').post(createUsers)

router.route('/:id').get(getUser)
router.route('/:id').patch(updateUser)
router.route('/:id').delete(deleteUser)

module.exports = router
