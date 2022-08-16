const express = require('express')

const db = require('../db')

const router = express.Router()

// CREATE A POST COMMENT

const createComment = async (req, res) => {
    try {
        const { id, userId, postId, content, published, createdAt } = req.body
        const newComment = await db.query(
            'INSERT INTO comments (id , "userId", "postId", content , published , "createdAt" ) VALUES ($1 , $2 , $3 , $4 , $5 ,$6 ) RETURNING *',
            [id, userId, postId, content, published, createdAt]
        )
        res.json(newComment)
    } catch (err) {
        console.error(err.message)
    }
}

// Routes
router.route('/').post(createComment)

module.exports = router
