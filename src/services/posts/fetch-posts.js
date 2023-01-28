const db = require("../../db")

const fetchPosts = async(isFlagged, cursor, limit) => {
	
	let selectClause = `
	SELECT posts.id, posts."userId" , posts.title, posts.image,
	posts.content,posts.published, posts."createdAt", posts.type,
	posts."likesCount",
	users."firstName", users."lastName", users.email,
	users."profilePictureUrl" 
	`

	 const fromClause = `FROM posts`
	  
	 const joinClause = `INNER JOIN users on posts."userId" = users.id`
	 let whereClauseArray = []
	 let orderByClause = `ORDER BY posts."createdAt" DESC`
	 const limitClause = `LIMIT ${limit}`


	// eslint-disable-next-line no-unused-expressions
	cursor && whereClauseArray.push(`WHERE posts."id" > ${cursor}`)

	if(isFlagged !== undefined){
		selectClause+= `, posts."flagsCount"`
		whereClauseArray.push(`posts."flagsCount"
		 ${isFlagged ? '>': '='} 0`)
		orderByClause =`ORDER BY "flagsCount" DESC`
	}
	

	if(whereClauseArray[0] !== undefined){
	// eslint-disable-next-line no-unused-expressions
		whereClauseArray[0].startsWith('posts') === true ?
			whereClauseArray = [`WHERE posts."flagsCount"
		${isFlagged ? '>': '='} 0`] : 
			whereClauseArray
	}
		
	const feed = await db.query(`
${selectClause} ${fromClause} ${joinClause} 
${whereClauseArray.join(' AND ')} ${orderByClause} ${limitClause};
`
	) 
	
	return feed.rows

}
module.exports = fetchPosts