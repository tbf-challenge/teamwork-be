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
const checkId = (req, res, next, val) => {
    console.log(`user id is ${val}`)
    next()
}

router.param('id', checkId)
router.route('/').get(fetchUsers).post(createUsers)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
