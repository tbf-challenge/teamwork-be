const db = require("../../db")

const unflagPost = ({userId, postId}) => 
	db.query(
		`DELETE FROM post_flags
        WHERE "userId" = $1
        AND "postId" = $2`,
		[userId, postId]
	)
	
module.exports = unflagPost