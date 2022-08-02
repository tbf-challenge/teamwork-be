const express = require('express')

const app = express()

const bodyparser = require('body-parser')

const pool = require('./db')

app.use(express.json())

app.use(bodyparser.json())

app.use(bodyparser.urlencoded({ extended: true }))

// ROUTES

// GET ALL ARTICLES

// GET A ARTICLE

// CREATE AN ARTICLE

app.post('/articles', async (req, res) => {
    try {
        const { title, article } = req.body
        const newArticle = await pool.query(
            `insert into article (title, article)
   VALUES ($1 , $2 ) RETURNING *`,
            [title, article]
        )
        res.json(newArticle)
    } catch (err) {
        console.error(err.message)
    }
})

// UPDATE AN ARTICLE

// DELETE AN ARTICLE

app.listen(5000, () => {
    console.log(`server is running `)
})
