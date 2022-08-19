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
            res.status(400).json({ message: 'Tag already exists' })
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

// UPDATE TAG

const updateTag = async (req, res) => {
    try {
        const { tid } = req.params
        const { content, title } = req.body

        const updatedTag = await db.query(
            'UPDATE tags SET content = $1, title = $2 WHERE id = $3 RETURNING *',
            [content, title, tid]
        )

        res.status(200).json({
            message: 'Tag has been successfully updated',
            data: updatedTag.rows[0],
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error })
    }
}

// DELETE TAG

const deleteTag = async (req, res) => {
    try {
        const { tagId } = req.params

        await db.query('DELETE FROM tags WHERE id = $1', [tagId])

        res.status(200).json({ message: 'Tag has been successfully deleted' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error })
    }
}

tagRouter.route('/').get(fetchTags).post(createTag)
tagRouter.route('/:tagId').patch(updateTag).delete(deleteTag)

module.exports = tagRouter
