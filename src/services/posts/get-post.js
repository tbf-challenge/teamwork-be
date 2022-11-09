const db = require("../../db")
const {
	ArticleDoesNotExistError,
	GifDoesNotExistError
	
} = require("../errors")
const customError = require("../../lib/custom-error")


const getPost = async({id, type}) => {
	const result = await db.query(
		`SELECT p.id, p."userId", p.title, p.image, p.content, p.published,
		p."createdAt", p.type, 
		jsonb_agg(c.* ORDER BY c."createdAt" DESC) as comments
		FROM posts p 
		LEFT JOIN comments c ON p.id = c."postId"
		WHERE p.id=$1 AND p.type =$2
		GROUP BY p.id;`,
		[id, type]
	)
	const post = result.rows[0]
	if (!post) {
		throw customError(
			type === 'article' ?
				ArticleDoesNotExistError : GifDoesNotExistError)
	}
	return post
}

module.exports = getPost