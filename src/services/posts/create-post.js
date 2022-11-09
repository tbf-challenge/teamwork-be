const db = require("../../db")

const createPost = async({
	userId, 
	title, 
	image, 
	likesCount, 
	content, 
	published,
	type
}) => {
	const newPost = await db.query(
		`INSERT INTO posts
		 ("userId", title , image , "likesCount", content , published, type )
		  VALUES ($1 , $2 , $3 , $4 , $5, $6, $7 ) 
		  RETURNING *`,
		[userId, title, image, likesCount, content, published, type]
	)

	return newPost.rows[0]
}

module.exports = createPost