const express = require('express')

const db = require('../db')

const router = express.Router()

// CREATE AN ARTICLE

const createPost = async (req, res, next) => {
    try {
        const { userId, title, image, content, published } = req.body
        const newArticle = await db.query(
            'INSERT INTO posts ("userId", title , image , content , published ) VALUES ($1 , $2 , $3 , $4 , $5 ) RETURNING *',
            [userId, title, image, content, published]
        )
        const articleBody = newArticle.rows[0]
        res.status(201).json({
            status: 'success',
            data: {
                message: 'Article successfully posted',
                id: articleBody.id,
                userId: articleBody.userId,
                title: articleBody.title,
                image: articleBody.image,
                content: articleBody.content,
                published: articleBody.published,
                createdAt: articleBody.createdAt,
            },
        })
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

// ASSIGN TAG TO AN ARTICLE

const assignTagToPost = async (req, res) => {
    try {
        const { id } = req.params // post id;
        const { tagId, content, title } = req.body

        const postsTags = await db.query(
            'INSERT INTO posts_tags ("postId","tagId",content,title) VALUES ($1,$2,$3,$4) RETURNING *',
            [id, tagId, content, title]
        )

        res.status(202).json({
            message: 'Tag has been successfully assigned to the post',
            tag: postsTags.rows[0],
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error })
    }
}

// Routes
router.route('/').post(createPost)
router.route('/:id/tags').post(assignTagToPost)

module.exports = router
