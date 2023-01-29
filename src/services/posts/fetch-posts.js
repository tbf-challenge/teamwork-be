const db = require("../../db")

const DEFAULT_LIMIT = 20

const fetchData = async(isFlagged, cursor, limit ) => {
	let selectClause = `
	SELECT posts.id, posts."userId" , posts.title, posts.image,
	posts.content,posts.published, posts."createdAt", posts.type,
	posts."likesCount",
	users."firstName", users."lastName", users.email,
	users."profilePictureUrl" 
	`

	 const fromClause = `FROM posts`
	  
	 const joinClause = `INNER JOIN users on posts."userId" = users.id`
	 const whereClauseArray = []
	 let orderByClause = `ORDER BY posts."createdAt" DESC`
	 const limitClause = `LIMIT ${limit}`


	// eslint-disable-next-line no-unused-expressions
	cursor && whereClauseArray.push(` posts."id" > ${cursor}`)

	if(isFlagged !== undefined){
		selectClause+= `, posts."flagsCount"`
		whereClauseArray.push(`posts."flagsCount"
		 ${isFlagged ? '>': '='} 0`)
		orderByClause =`ORDER BY "flagsCount" DESC`
	}
	
	const whereClause = (whereClauseArray.length > 0 ? ' WHERE ' : '') 
	+ whereClauseArray.join(' AND ')

	const result = await db.query(`
${selectClause} ${fromClause} ${joinClause} 
${whereClause} ${orderByClause} ${limitClause};
`
	) 
	const feed = result.rows
	return feed
}

const getTotalCount = async(isFlagged) => {
	const selectClause = `SELECT COUNT(posts)`
	const fromClause = `FROM posts`
	let whereClause = ''

	if(isFlagged !== undefined){
	
		whereClause = (`WHERE posts."flagsCount"
		 ${isFlagged ? '>': '='} 0`)
	}

	const value = await db.query(` 
	 ${selectClause} ${fromClause} ${whereClause};`)
	const count = value.rows[0]
	return Number(count.count)
}
const fetchPosts = async(isFlagged, cursor, limit = DEFAULT_LIMIT ) => {
	
	const feed = await fetchData(isFlagged, cursor, limit) 
	const count = await getTotalCount(isFlagged)
	return {feed , count}

}
module.exports = fetchPosts