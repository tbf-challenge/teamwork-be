const express = require('express')

const db = require('../db')

const router = express.Router()

// CREATE A POST COMMENT

const createComment = async (req, res, next) => {
    try {
        const { postId } = req.params
        const { userId, comment } = req.body

        const post = await db.query('SELECT * FROM posts WHERE id = $1', [
            postId,
        ])
        const result = post.rows[0]
        const postComments = await db.query(
            'INSERT INTO comments ("userId" , "postId", content) VALUES ($1 , $2 ,$3) RETURNING *',
            [userId, postId, comment]
        )

        const postComment = postComments.rows[0]
        res.status(201).json({
            status: 'success',
            data: {
                message: 'Comment successfully created',
                createdAt: postComment.createdAt,
                postTitle: result.title,
                postContent: result.content,
                comment: postComment.content,
            },
        })
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
router.route('/:postId/comment').post(createComment)
module.exports = router
