const express = require('express')

const db = require('../db')

const router = express.Router()

// CREATE AN ARTICLE

const createPost = async (req, res, next) => {
    try {
        const { id, userId, title, image, content, published } = req.body
        const newArticle = await db.query(
            'INSERT INTO posts ( id , "userId", title , image , content , published ) VALUES ($1 , $2 , $3 , $4 , $5 , $6) RETURNING *',
            [id, userId, title, image, content, published]
        )
        res.status(201).json({
            status: 'success',
            data: {
                message: 'Article successfully posted',
                id: newArticle.id,
                userId,
                title,
                image,
                content,
                published,
                createdAt: 'current_timestamp',
            },
        })
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

// Routes
router.route('/').post(createPost)

module.exports = router
