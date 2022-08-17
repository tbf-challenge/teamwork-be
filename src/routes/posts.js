const express = require('express')

const db = require('../db')

const router = express.Router()

// CREATE A POST COMMENT

const createComment = async (req, res, near) => {
    try {
        const { id, userId, postId, content, published, createdAt } = req.body
        await db.query(
            'INSERT INTO comments (id , "userId", "postId", content , published , "createdAt" ) VALUES ($1 , $2 , $3 , $4 , $5 ,$6 ) RETURNING *',
            [id, userId, postId, content, published, createdAt]
        )

        res.status(201).json({
            status: 'success',
            data: {
                message: 'Comment successfully created',
                createdAt,
                // postTitle
                content,
                // comment,
            },
        })
    } catch (err) {
        console.error(err.message)
        near(err)
    }
}

// Routes
router.route('/').post(createComment)

module.exports = router
