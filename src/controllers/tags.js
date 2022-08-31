/* eslint-disable consistent-return */
/* eslint-disable indent */
// APLICATION LOGIC FOR TAGGING
const { catchAsync, AppError } = require('../lib')
const tagService = require('../services/tags')


// CREATE NEW TAG
// eslint-disable-next-line consistent-return
const createNewTag = catchAsync(async (req, res, next) => {
    const { content, title } = req.body
    const newTag = await tagService
        .createTag({ content, title })

    if (!newTag) return next(new AppError("Tag already exists", 400))

    res.status(201).json({
        status: "success",
        data: {
            id: newTag.id,
            title: newTag.title,
            content: newTag.content
        }
    })
})


// GET ALL TAGS
const fetchTags = catchAsync(async (req, res) => {

    const allTags = await tagService.fetchTags()

    res.status(200).json({
        status: 'success',
        data: allTags.map((tag) => ({
            id: tag.id,
            title: tag.title,
            content: tag.content
        }))
    })

})

// UPDATE A TAG
// eslint-disable-next-line consistent-return
const updateTag = catchAsync(async (req, res, next) => {
    const { tagId } = req.params
    const { content, title } = req.body

    const updatedTag = await tagService
        .updateTag(title, content, tagId)

    if (!updatedTag) {
        return next(new AppError('Tag does not exist', 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            id: updatedTag.id,
            title: updatedTag.title,
            content: updatedTag.content
        }
    })
})


// DELETE A TAG

const deleteTag = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const response = await tagService.deleteTag(id)
    if (!response.status === "Success")
        return next(new AppError('No tag with that Id', 404))

    // Should the response code be 200 or 204 ?
    res.status(200).json({
        status: "success",
        data: { message: "Tag has been successfully deleted" }
    })
})

module.exports = {
    createNewTag,
    fetchTags,
    updateTag,
    deleteTag
}