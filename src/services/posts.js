const db = require("../db")


const createPost = async({userId, title, image, content, published}) => {
	const newPost = await db.query(
		// eslint-disable-next-line max-len
		'INSERT INTO posts ("userId", title , image , content , published ) VALUES ($1 , $2 , $3 , $4 , $5 ) RETURNING *',
		[userId, title, image, content, published]
	)
	return newPost.rows[0]
}

const getPost = async({id}) => {
	const post = await db.query(
		`SELECT p.*, jsonb_agg(c.* ORDER BY c."createdAt" DESC) as comments
	FROM posts p 
	LEFT JOIN comments c ON p.id = c."postId"
	WHERE p.id=$1 
	GROUP BY p.id;`,
		[id]
	)
	return post.rows[0]
}
module.exports = {
	createPost,
	getPost
}