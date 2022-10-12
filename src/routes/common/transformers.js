
const transformArticleResponse = (article) => ({
	userId: article.userId,
	title: article.title,
	image: article.image,
	article: article.content,
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
	published : gif.published
	
})

const transformUserResponse = (userDetails) => ({
	id: userDetails.id,
	firstName: userDetails.firstName,
	lastName: userDetails.lastName,
	email: userDetails.email,
	gender: userDetails.gender,
	jobRole: userDetails.jobRole,
	department: userDetails.department,
	address: userDetails.address,
	profilePictureUrl: userDetails.profilePictureUrl
})


module.exports = {
	transformArticleResponse,
	transformGifResponse,
	transformUserResponse
}