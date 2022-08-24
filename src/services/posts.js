const db = require("../db")


const createPost = async({userId, title, image, content, published}) => {
	const newPost = await db.query(
		// eslint-disable-next-line max-len
		'INSERT INTO posts ("userId", title , image , content , published ) VALUES ($1 , $2 , $3 , $4 , $5 ) RETURNING *',
		[userId, title, image, content, published]
	)
	return newPost.rows[0]
}

module.exports = {
	createPost
}