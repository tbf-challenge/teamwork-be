const express = require('express')

const db = require('../db')

const router = express.Router()

const dateTime = new Date().toJSON()

// CREATE AN ARTICLE

const createPosts = async (req, res, next) => {
    try {
        const { id, userId, title, image, content, published, createdAt } =
            req.body
        await db.query(
            'INSERT INTO posts (id , "userId", title , image , content , published , "createdAt" ) VALUES ($1 , $2 , $3 , $4 , $5 ,$6 , $7) RETURNING *',
            [id, userId, title, image, content, published, createdAt]
        )
        res.status(201).json({
            status: 'success',
            data: {
                message: 'Article successfully posted',
                id,
                createdOn: dateTime,
                title,
            },
        })
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

// Routes
router.route('/').post(createPosts)

module.exports = router
