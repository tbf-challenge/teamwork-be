const db = require("../../db")

const unlikePost = async({userId, postId}) => {
	const newUnlike = await db.query(
		`DELETE FROM post_likes
        WHERE "userId" = $1
        AND "postId" = $2`,
		[userId, postId]
	)
	/* There is a trigger on the post_likes table that computes and updates 
	the likesCount column in the posts table on every delete */
	return newUnlike
}

module.exports = unlikePost