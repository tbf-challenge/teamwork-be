const db = require("../../db")

const unflagPost = ({userId, postId}) => 
	db.query(
		`DELETE FROM post_flags
        WHERE "userId" = $1
        AND "postId" = $2`,
		[userId, postId]
	)
	
/* There is a trigger on the post_flags table that computes and updates 
	the flagsCount column in the posts table on every delete */

module.exports = unflagPost