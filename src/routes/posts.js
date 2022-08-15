const express = require('express')

const db = require('../db')

const router = express.Router()

// UPDATE AN ARTICLE

const updatePost = async (req, res) => {
    const { id } = req.params // WHERE
    const { title, image, content, published } = req.body // SET
    try {
        await db.query(
            'UPDATE posts SET title = $1, image = $2 , content = $3 , published = $4 WHERE id = $5',
            [title, image, content, published, id]
        )
        res.json('Article was successfully updated')
    } catch (err) {
        console.error(err.message)
    }
}

const checkId = (req, res, next, val) => {
    console.log(`user id is ${val}`)
    next()
}

// Routes
router.param('id', checkId)
router.route('/:id').patch(updatePost)

module.exports = router
