
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


module.exports = {
	transformArticleResponse,
	transformGifResponse

}