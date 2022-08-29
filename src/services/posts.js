const db = require("../db")
const { ArticleDoesNotExistError } = require("./errors")
const { AppError } = require("../lib")


//	CREATE ARTICLE ENDPOINT
const createPost = async ({ userId, title, image, content, published }) => {
	const newPost = await db.query(
		// eslint-disable-next-line max-len
		'INSERT INTO posts ("userId", title , image , content , published ) VALUES ($1 , $2 , $3 , $4 , $5 ) RETURNING *',
		[userId, title, image, content, published]
	)
	return newPost.rows[0]
}

// CREATE ARTICLE COMMENT

const createComment = async ({ id, userId, comment }) => {
	const result = await db.query('SELECT * FROM posts WHERE id = $1', [id])
	const post = result.rows[0]
	if (!post) {
		const errorMessage = ArticleDoesNotExistError.message
		const err = Error(errorMessage)
		err.name = ArticleDoesNotExistError.name
		throw err
	}

	const queryResult = await db.query(
		`INSERT INTO comments ("userId" , "postId" , content)
	 VALUES ($1 , $2 ,$3) RETURNING *`,
		[userId, id, comment]
	)
	const insertedComment = queryResult.rows[0]
	return { post, insertedComment }
}
// GET ARTICLE BY ID ENDPOINT
const getPost = async ({ id }) => {
	const post = await db.query(
		`SELECT p.*, jsonb_agg(c.* ORDER BY c."createdAt" DESC) as comments
	FROM posts p 
	LEFT JOIN comments c ON p.id = c."postId"
	WHERE p.id=$1 
	GROUP BY p.id;`,
		[id]
	)
	return post.rows[0]
}

// GET ALL POSTS
const getAllPosts = async () => {
	try {
		const feed = await db.query('SELECT * FROM posts')
		const allArticles = feed.rows

		return allArticles

	} catch (error) {
		throw new Error(error)
	}
}

// ASSIGN TAG TO POST
const assignTagToPost = async (tagId, postId) => {
	const postsTags = await db.query(
		// eslint-disable-next-line max-len
		'INSERT INTO posts_tags ("postId","tagId") SELECT $1,$2 WHERE NOT EXISTS (SELECT * FROM posts_tags WHERE "postId" = $1 AND "tagId" = $2) RETURNING *',
		[postId, tagId]
	)
	if (!postsTags.rows[0]) {
		throw new AppError('Tag is already assigned to the post', 400)
	}

	return postsTags.rows[0]
}

const queryPostsWithSameTag = async (tag) => {
	try {
		const feed = await db.query(
			// eslint-disable-next-line max-len
			'SELECT * FROM posts p INNER JOIN posts_tags pt ON p.id=pt."postId" WHERE "tagId"=$1',
			[tag]
		)
		const allArticles = feed.rows
		return allArticles
	} catch (error) {
		throw new Error(error)
	}
}

// DELETE POST
const deletePost = async (id) => {
	try {
		await db.query('DELETE FROM posts WHERE id = $1', [id])
		return { status: "Success" }
	} catch (error) {
		throw new Error(error)
	}
}

// DELETE POST TAG
const deletePostTag = async (postId, tagId) => {
	try {
		await db.query(
			'DELETE FROM posts_tags WHERE "postId" = $1 AND "tagId" = $2',
			[postId, tagId]
		)
		return { status: "Success" }
	} catch (error) {
		throw new Error(error)
	}
}

const updatePost = async (title, content, image, published, id) => {
	try {
		const result = await db.query(
			// eslint-disable-next-line max-len
			'UPDATE posts SET title = $1, content = $2 , image = $3 , published = $4 WHERE id = $5 RETURNING *',
			[title, content, image, published, id]
		)
		const updatedArticle = result.rows[0]
		return updatedArticle

	} catch (error) {
		throw new Error(error)
	}
}
module.exports = {
	createPost,
	getPost,
	createComment,
	getAllPosts,
	assignTagToPost,
	queryPostsWithSameTag,
	deletePost,
	deletePostTag,
	updatePost
}