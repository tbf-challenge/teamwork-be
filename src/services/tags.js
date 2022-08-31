/* eslint-disable indent */
const db = require("../db")

//	CREATE TAG ENDPOINT
const createTag = async ({ content, title }) => {
    const newTag = await db.query(
        // eslint-disable-next-line max-len
        "INSERT INTO tags (content, title) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM tags WHERE title = $2) RETURNING *",
        [content, title]
    )

    return newTag.rows[0]
}

// FETCH ALL TAGS
const fetchTags = async () => {
    try {
        const tags = await db.query("SELECT * FROM tags")
        const allTags = tags.rows

        return allTags

    } catch (error) {
        throw new Error(error)
    }
}

// UPDATE TAGS
const updateTag = async (title, content, tagId) => {
    try {
        const result = await db.query(
            // eslint-disable-next-line max-len
            "UPDATE tags SET content = $1, title = $2 WHERE id = $3 RETURNING *",
            [content, title, tagId]
        )
        const updatedTag = result.rows[0]
        return updatedTag

    } catch (error) {
        throw new Error(error)
    }
}

// DELETE TAG
const deleteTag = async (tagId) => {
    try {
        await db.query("DELETE FROM tags WHERE id = $1", [tagId])
        return {
            status: "Success"
        }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createTag,
    fetchTags,
    updateTag,
    deleteTag
}