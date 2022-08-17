const express = require('express')

const db = require('../db')

const router = express.Router()

// UPDATE AN ARTICLE

const updatePost = async (req, res, next) => {
    const { id } = req.params // WHERE
    const { title, content } = req.body // SET
    try {
        await db.query(
            'UPDATE posts SET title = $1, content = $2  WHERE id = $3',
            [title, content, id]
        )
        res.status(201).json({
            status: 'success',
            data: {
                message: 'Article successfully updated',
                title,
                content,
            },
        })
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

// Routes

router.route('/:id').patch(updatePost)

module.exports = router
