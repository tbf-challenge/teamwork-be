const express = require('express')
const morgan = require('morgan')
const { Pool } = require('pg')

const pool = require('./db/index')

const router = require('./routes')

const app = express()

// Middleware
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// GET ALL ARTICLES
app.get('/', (req, res) => {
    res.send('Hello friend')
})

// GET A ARTICLE

// CREATE an ARTICLE
app.post('/article', async (req, res) => {
    try {
        const { id, title, images, content, authorId, published } = req.body
        const newArticle = await pool.query(
            'INSERT INTO article (id , title , images , content , authorId , published) VALUES ($1 , $2 , $3 , $4 , $5 ,$6) RETURNING *',
            [id, title, images, content, authorId, published]
        )
        res.json(newArticle)
    } catch (err) {
        console.error(err.message)
    }
})
// UPDATE ARTICLES

// DELETE ARTICLES

// Routes
app.use('api/v1', router)

module.exports = app
