const express = require('express')

const db = require('../db')

const router = express.Router()

// GET AN ARTICLE BY ID

const getPost = async (req, res) => {
    const { id } = req.params
    try {
        const article = await db.query('SELECT * FROM posts WHERE id = $1 ', [
            id,
        ])
        res.json(article.rows[0])
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
router.route('/:id').get(getPost)

module.exports = router
