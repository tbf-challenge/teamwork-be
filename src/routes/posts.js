const express = require('express')

const db = require('../db')

const router = express.Router()

// CREATE ARTICLE ENDPOINT

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

// GET ALL ARTICLES (feed)

const fetchPosts = async (req, res, next) => {
    try {
        const feed = await db.query('SELECT * FROM posts')
        const allArticles = feed.rows

        res.status(200).json({
            status: 'success',
            data: allArticles.map((article) => ({
                id: article.id,
                userId: article.userId,
                title: article.title,
                content: article.content,
                image: article.image,
                published: article.published,
                createdAt: article.createdAt,
            })),
        })
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

// DELETE AN ARTICLE

const deletePost = async (req, res, next) => {
    const { id } = req.params

    try {
        await db.query('DELETE FROM posts WHERE id = $1', [id])

        res.status(200).json({
            status: 'success',
            data: {
                message: 'Article was successfully deleted',
            },
        })
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

// UPDATE AN ARTICLE

const updatePost = async (req, res) => {
    const { id } = req.params // WHERE
    const { title, content, image, published } = req.body // SET

    try {
        const result = await db.query(
            'UPDATE posts SET title = $1, content = $2 , image = $3 , published = $4 WHERE id = $5 RETURNING *',
            [title, content, image, published, id]
        )
        const updatedArticle = result.rows[0]

        if (!updatedArticle) {
            res.status(404).json({
                success: false,
                message: 'Article does not exist',
            })
        } else {
            res.status(200).json({
                status: 'success',
                data: {
                    message: 'Article successfully updated',
                    title: updatedArticle.title,
                    content: updatedArticle.content,
                    image: updatedArticle.image,
                    published: updatedArticle.published,
                },
            })
        }
    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            error,
        })
    }
}

// Routes

router.route('/:id').delete(deletePost).patch(updatePost)
router.route('/').post(createPost).get(fetchPosts)

module.exports = router
