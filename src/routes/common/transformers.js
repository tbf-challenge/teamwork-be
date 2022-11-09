
const transformArticleResponse = (article) => ({
	userId: article.userId,
	title: article.title,
	image: article.image,
	article: article.content,
	likesCount: article.likesCount,
	published: article.published,
	createdOn: article.createdAt,
	articleId: article.id,
	tagId : article.tagId
})

const transformGifResponse = (gif) => ({
	userId: gif.userId,
	title: gif.title,
	imageUrl: gif.content,
	createdOn: gif.createdAt,
	gifId: gif.id,
	published : gif.published,
	likesCount : gif.likesCount
	
})

const transformUserResponse = (userDetails) => ({
	userId: userDetails.id,
	firstName: userDetails.firstName,
	lastName: userDetails.lastName,
	email: userDetails.email,
	gender: userDetails.gender,
	role : userDetails.role,
	jobRole: userDetails.jobRole,
	department: userDetails.department,
	address: userDetails.address,
	profilePictureUrl: userDetails.profilePictureUrl,
	createdOn : userDetails.createdAt
})


module.exports = {
	transformArticleResponse,
	transformGifResponse,
	transformUserResponse
}