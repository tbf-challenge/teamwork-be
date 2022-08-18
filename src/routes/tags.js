const tagRouter = require('express').Router()
const db = require('../db')

// FETCH ALL PREDEFINED TAGS

const fetchTags = async (_req, res) => {
    try {
        const tags = await db.query('SELECT * FROM tags')
        res.status(200).json(tags.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error })
    }
}

// ASSIGN TAG TO POST

tagRouter.route('/').get(fetchTags)

module.exports = tagRouter
