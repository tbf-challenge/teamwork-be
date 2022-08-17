const express = require('express')
const db = require('../db')

const router = express.Router()

const fetchPosts = async (req, res, next) => {
    try {
        const allArticles = await db.query('SELECT * FROM posts')
        res.status(201).json(allArticles.rows)
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

router.route('/').get(fetchPosts)

module.exports = router
