const db = require("../../db")

const fetchPosts = async(isFlagged) => {
	
	let feed 
	if(isFlagged){
		feed = await db.query(`
		SELECT posts.id, posts."userId" , posts.title, posts.image,
		posts.content,posts.published, posts."createdAt", posts.type,
		posts."likesCount", posts."flagsCount",
		users."firstName", users."lastName", users.email,
		users."profilePictureUrl" 
		FROM posts
		INNER JOIN users on posts."userId" = users.id
		WHERE posts."flagsCount" > 0;
		`)
	}
	else(
		feed = await db.query(`
	SELECT posts.id, posts."userId" , posts.title, posts.image, posts.content,
	posts.published, posts."createdAt", posts.type, posts."likesCount",
	users."firstName", users."lastName", users.email, users."profilePictureUrl" 
	FROM posts
	INNER JOIN users on posts."userId" = users.id;
	`)
	)
	return feed.rows

}
module.exports = fetchPosts