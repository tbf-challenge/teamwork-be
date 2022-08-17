const express = require('express')

const db = require('../db')

const router = express.Router()

const date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0))

// CREATE A POST COMMENT

const createComment = async (req, res) => {
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
                createdOn: date.toLocaleDateString(),
                articleTitle: String,
                article: String,
                comment: String,
            },
        })
    } catch (err) {
        console.error(err.message)
    }
}

// Routes
router.route('/').post(createComment)

module.exports = router
