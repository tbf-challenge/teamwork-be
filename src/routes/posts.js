const express = require('express')

const db = require('../db')

const router = express.Router()

// CREATE AN ARTICLE

const createPosts = async (req, res) => {
    try {
        const { id, userId, title, image, content, published, createdAt } =
            req.body
        const newArticle = await db.query(
            'INSERT INTO posts (id , "userId", title , image , content , published , "createdAt" ) VALUES ($1 , $2 , $3 , $4 , $5 ,$6 , $7) RETURNING *',
            [id, userId, title, image, content, published, createdAt]
        )
        res.json(newArticle)
    } catch (err) {
        console.error(err.message)
    }
}

// Routes
router.route('/').post(createPosts)

module.exports = router
