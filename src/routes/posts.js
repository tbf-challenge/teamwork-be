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

// ASSIGN TAG TO AN ARTICLE

const assignTagToPost = async (req, res) => {
    try {
        const { postId } = req.params // post id;
        const { tagId, content, title } = req.body

        const postsTags = await db.query(
            'INSERT INTO posts_tags ("postId","tagId",content,title) SELECT $1,$2,$3,$4 WHERE NOT EXISTS (SELECT * FROM posts_tags WHERE "postId" = $1 AND "tagId" = $2) RETURNING *',
            [postId, tagId, content, title]
        )

        if (!postsTags.rows[0]) {
            res.status(400).json({
                message: 'Tag is already assigned to the post',
            })
        } else {
            res.status(201).json({
                message: 'Tag has been successfully assigned to the post',
                data: {
                    postId: postsTags.rows[0].postId,
                    tagId: postsTags.rows[0].tagId,
                    title: postsTags.rows[0].title,
                    content: postsTags.rows[0].content,
                },
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error })
    }
}

// GET ALL ARTICLES WITH SAME TAG

const queryPosts = async (req, res) => {
    try {
        const { tag } = req.query

        // get all posts' id having the same tag
        const postsIds = await db.query(
            'SELECT ("postId") FROM posts_tags WHERE "tagId" = $1',
            [tag]
        )

        // query for all feeds same tag
        const feeds = await Promise.all(
            postsIds.rows.map(async ({ postId }) => {
                const post = await db.query(
                    'SELECT * FROM posts WHERE id = $1',
                    [postId]
                )
                return {
                    id: post.rows[0].id,
                    userId: post.rows[0].userId,
                    title: post.rows[0].title,
                    image: post.rows[0].image,
                    content: post.rows[0].content,
                    published: post.rows[0].published,
                    createdAt: post.rows[0].createdAt,
                }
            })
        )

        res.status(200).json({
            status: 'success',
            data: feeds,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error })
    }
}

// DELETE TAGS IN AN ARTICLE

const deletePostTags = async (req, res) => {
    try {
        const { postId, tagId } = req.params

        await db.query(
            'DELETE FROM posts_tags WHERE "postId" = $1 AND "tagId" = $2',
            [postId, tagId]
        )

        res.status(200).json({ message: 'Tag has been removed from post' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error })
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

// Routes

router.route('/:id').delete(deletePost)
router.route('/').post(createPost).get(fetchPosts)
router.route('/query').get(queryPosts)
router.route('/:postId/tags').post(assignTagToPost)
router.route('/:postId/tags/:tagId').delete(deletePostTags)

module.exports = router
