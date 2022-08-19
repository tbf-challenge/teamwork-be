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

// CREATE NEW TAG

const createTag = async (req, res) => {
    try {
        const { content, title } = req.body

        const newTag = await db.query(
            'INSERT INTO tags (content, title) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM tags WHERE title = $2) RETURNING *',
            [content, title]
        )

        if (!newTag.rows[0]) {
            res.status(400).json({ message: 'Tag already exits' })
        } else {
            res.status(202).json({
                message: 'Successfully created a new tag',
                data: newTag.rows[0],
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error })
    }
}

tagRouter.route('/').get(fetchTags).post(createTag)

module.exports = tagRouter
