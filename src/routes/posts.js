const express = require('express')

const db = require('../db')

const router = express.Router()

// GET AN ARTICLE BY ID

const getPost = async (req, res, next) => {
    const { id } = req.params
    try {
        const posts = await db.query(
            'SELECT p.*, jsonb_agg(c.* ORDER BY c."createdAt" DESC) as comments FROM posts p LEFT JOIN comments c ON p.id = c."postId" WHERE p.id=$1 GROUP BY p.id;',
            [id]
        )
        const article = posts.rows[0]

        res.status(200).json({
            status: 'success',
            data: {
                id: article.id,
                createdAt: article.createdAt,
                title: article.title,
                image: article.image,
                published: article.published,
                comments: article.comments
                    .filter((comment) => comment)
                    .map((comment) => ({
                        id: comment.id,
                        comment: comment.comment,
                        userId: comment.userId,
                    })),
            },
        })
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

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

// Routes

router.route('/:id').get(getPost)

router.route('/').post(createPost).get(fetchPosts)

module.exports = router
