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

// GET ALL ARTICLES

const fetchPosts = async (req, res, next) => {
    try {
        const allArticles = await db.query('SELECT * FROM posts')

        const articles = allArticles.rows
        console.log(articles)

        res.status(201).json({
            status: 'success',
            // data: articles.map((article) => {
            // id : article.id,
            // userId : article.userId,
            // createdAt : article.createdAt,
            // title : article.title,
            // content : article.content,
            // image : article.image,
            // published : article.published
            // createdAt : article.createdAt
            // }),
        })
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

// Routes
router.route('/').post(createPost)
router.route('/').get(fetchPosts)

module.exports = router
