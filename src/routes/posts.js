const express = require('express')

const db = require('../db')

const router = express.Router()

// GET AN ARTICLE BY ID

const getPost = async (req, res, near) => {
    const { id } = req.params
    try {
        const article = await db.query('SELECT * FROM posts WHERE id = $1 ', [
            id,
        ])
        res.status(201).json(article.rows[0])
    } catch (err) {
        console.error(err.message)
        near(err)
    }
}

// Routes

router.route('/:id').get(getPost)

module.exports = router
