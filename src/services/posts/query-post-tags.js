const db = require("../../db")

const queryPostTags = async({tag}) => {
	const feed = await db.query(
		`SELECT posts.id, posts."userId" , posts.title, posts.image, 
        posts.content, posts.published, posts."createdAt", posts.type,
        posts_tags."postId", posts_tags."tagId"
        FROM posts 
		INNER JOIN posts_tags
		ON posts.id = posts_tags."postId" 
		WHERE "tagId"=$1`,
		[tag]
	)
	return feed.rows
}


module.exports = queryPostTags