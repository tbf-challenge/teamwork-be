const db = require("../../db")

const fetchPosts = async(isFlagged) => {

	
	let selectClause = `
	SELECT posts.id, posts."userId" , posts.title, posts.image,
	posts.content,posts.published, posts."createdAt", posts.type,
	posts."likesCount",
	users."firstName", users."lastName", users.email,
	users."profilePictureUrl" 
	`

	 const fromClause = `FROM posts`
	  
	 const joinClause = `INNER JOIN users on posts."userId" = users.id`
	 let whereClause = ''
	 let orderByClause = `ORDER BY posts."createdAt" DESC`
	   
	 if(isFlagged !== undefined){
		 selectClause+= `, posts."flagsCount"`
		 
		whereClause += `
			WHERE posts."flagsCount" ${isFlagged ? '>': '='} 0`
		orderByClause+=`ORDER BY "flagsCount" DESC`
	 }

	const feed = await db.query(`
${selectClause} ${fromClause} ${joinClause} ${whereClause} ${orderByClause};
`
	) 
	
	return feed.rows

}
module.exports = fetchPosts