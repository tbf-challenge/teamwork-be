const db = require("../../db")
const {
	ArticleDoesNotExistError
} = require("../errors")
const customError = require("../../lib/custom-error")

const updatePost = async({title, content, image, published, id}) => {
	const result = await db.query(
		`UPDATE posts 
		SET title = $1, content = $2 , image = $3 , published = $4
		 WHERE id = $5 
		 RETURNING title, content , id, "createdAt",
		image, published, "userId"`,
		[title, content, image, published, id]
	)
	const updatedPost = result.rows[0]
	
	if (!updatedPost) {
		throw customError(ArticleDoesNotExistError)
	}
	
	return updatedPost

}

module.exports = updatePost
