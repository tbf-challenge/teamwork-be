const express = require('express')

const db = require('../db')

const router = express.Router()

// CREATE A POST COMMENT

const createComment = async (req, res, next) => {
    try {
        const { id } = req.params
        const { userId, comment } = req.body
        const postComments = await db.query(
            'INSERT INTO comments ("userId" , comment) VALUES ($1 , $2) RETURNING *',
            [userId, comment, id]
        )
        const post = await db.query(`SELECT * FROM posts WHERE id = ${id}`, [
            id,
        ])
        console.log(post)
        console.log(postComments)
        // res.status(201).json(postComments)
    } catch (err) {
        console.error(err.message)
        next(err)
    }
}

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

router.route('/').post(createPost).get(fetchPosts).post(createComment)

module.exports = router
