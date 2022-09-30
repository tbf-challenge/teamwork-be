const db = require("../../db")

/**
 * 
 * @param {Object} {userId, postId}
 */
const unlikePost = async({userId, postId}) => {
	await db.query(
		`DELETE FROM post_likes
         WHERE "userId" = $1 AND "postId" = $2` ,
		[userId, postId]
	)
}

module.exports = unlikePost