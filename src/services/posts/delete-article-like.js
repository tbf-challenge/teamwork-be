const db = require("../../db")

/**
 * 
 * @param {Object} {userId, postId}
 */
const deleteArticleLike = async({userId, postId}) => {
	await db.query(
		`DELETE FROM post_likes
         WHERE "userId" = $1 AND "postId" = $2` ,
		[userId, postId]
	)
}

module.exports = deleteArticleLike