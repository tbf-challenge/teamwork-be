const db = require("../../db")

const unlikePost = async({userId, postId}) => {
	const newUnlike = await db.query(
		`DELETE FROM post_likes
        WHERE "userId" = $1
        AND "postId" = $2`,
		[userId, postId]
	)
	return newUnlike
}

module.exports = unlikePost