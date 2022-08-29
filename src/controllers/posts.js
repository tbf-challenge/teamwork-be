/* eslint-disable indent */
const { catchAsync, AppError } = require('../lib')
const postService = require('../services/posts')

// GET ALL ARTICLES
const fetchPosts = catchAsync(async (req, res) => {

    const allArticles = await postService.getAllPosts()

    res.status(200).json({
        status: 'success',
        data: allArticles.map((article) => ({
            id: article.id,
            userId: article.userId,
            title: article.title,
            content: article.content,
            image: article.image,
            published: article.published,
            createdAt: article.createdAt
        }))
    })

})

// ASSIGN TAG TO AN ARTICLE
const assignTagToPost = catchAsync(async (req, res) => {
    const { postId } = req.params // post id;
    const { tagId } = req.body

    const postsTags = await postService.assignTagToPost(tagId, postId)
    res.status(200).json({
        status: 'success',
        data: {
            postId: postsTags.postId,
            tagId: postsTags.tagId
        }
    })
})

// GET ALL ARTICLES WITH SAME TAG
const queryPosts = catchAsync(async (req, res) => {
    const { tag } = req.query

    const allArticles = await postService
        .queryPostsWithSameTag(tag)

    res.status(200).json({
        status: 'success',
        data: allArticles.map((article) => ({
            id: article.id,
            userId: article.userId,
            title: article.title,
            content: article.content,
            image: article.image,
            published: article.published,
            createdAt: article.createdAt
        }))
    })
})

// DELETE REQUESTS

// DELETE AN ARTICLE

const deletePost = catchAsync(async (req, res) => {
    const { id } = req.params

    await postService.deletePost(id)

    // Should the response code be 200 or 204 ?
    res.status(200).json({
        status: 'success',
        data: {
            message: 'Article was successfully deleted'
        }
    })
})

// DELETE TAGS IN AN ARTICLE

const deletePostTags = catchAsync(async (req, res) => {
    const { postId, tagId } = req.params

    await postService.deletePostTag(postId, tagId)

    res.status(200).json({
        status: 'success',
        data: {
            message: 'Tag has been removed from post'
        }
    })
})

// PATCH REQUESTS

// UPDATE AN ARTICLE
// eslint-disable-next-line consistent-return
const updatePost = catchAsync(async (req, res, next) => {
    const { id } = req.params // WHERE
    const { title, content, image, published } = req.body // SET


    const updatedArticle = await postService
        .updatePost(title, content,
            image, published, id)

    if (!updatedArticle) {
        return next(new AppError('Article does not exist', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            message: 'Article successfully updated',
            title: updatedArticle.title,
            content: updatedArticle.content,
            image: updatedArticle.image,
            published: updatedArticle.published
        }

    })
})


module.exports = {
    fetchPosts,
    assignTagToPost,
    queryPosts,
    deletePost,
    deletePostTags,
    updatePost
}
