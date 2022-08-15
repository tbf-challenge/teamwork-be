const express = require('express')

const db = require('../db')

const router = express.Router()

// DELETE AN ARTICLE

const deletePost = async (req, res) => {
    const { id } = req.params

    try {
        await db.query('DELETE FROM posts WHERE id = $1', [id])
        res.json('Article was successfully deleted')
    } catch (err) {
        console.error(err.message)
    }
}

const checkId = (req, res, next, val) => {
    console.log(`user id is ${val}`)
    next()
}

// Routes
router.param('id', checkId)
router.route('/:id').delete(deletePost)

module.exports = router
