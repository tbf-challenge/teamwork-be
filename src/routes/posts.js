const express = require('express')
const db = require('../db')

const router = express.Router()

const fetchPosts = async (req, res) => {
    try {
        const allArticles = await db.query('SELECT * FROM posts')
        res.json(allArticles.rows)
    } catch (err) {
        console.error(err.message)
    }
}

router.route('/').get(fetchPosts)

module.exports = router
