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

// GET ALL ARTICLES (feed)

const fetchPosts = async (req, res, next) => {
    try {
        const feed = await db.query('SELECT * FROM posts')
        const allArticles = feed.rows

        res.status(201).json({
            status: 'success',
            data: allArticles.map((articles) => ({
                id: articles.id,
                userId: articles.userId,
                title: articles.title,
                content: articles.content,
                image: articles.image,
                published: articles.published,
                createdAt: articles.createdAt,
            })),
        })
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

// Routes
router.route('/').post(createPost).get(fetchPosts)

module.exports = router
