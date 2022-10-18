const db = require("../../db")

const createPost = async({userId, title, image, content, published, type}) => {
	const newPost = await db.query(
		`INSERT INTO posts
		 ("userId", title , image , content , published, type )
		  VALUES ($1 , $2 , $3 , $4 , $5, $6 ) 
		  RETURNING *`,
		[userId, title, image, content, published, type]
	)
	return newPost.rows[0]
}

module.exports = createPost