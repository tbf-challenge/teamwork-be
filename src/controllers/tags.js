/* eslint-disable indent */
// APLICATION LOGIC FOR TAGGING
const { catchAsync, AppError } = require('../lib')
const tagService = require('../services/tags')

const transFormTag = (tag) => {
    const data = {
        id: tag.id,
        title: tag.title,
        content: tag.content
    }
    return data
}
// CREATE NEW TAG
const createNewTag = catchAsync(async (req, res, next) => {
    const { content, title } = req.body
    const newTag = await tagService.createTag({ content, title })

    if (!newTag) return next(new AppError('Tag already exists', 400))
    const data = transFormTag(newTag)

    return res.status(201).json({
        status: 'success',
        data
    })
})

// GET ALL TAGS
const fetchTags = catchAsync(async (req, res) => {
    const allTags = await tagService.fetchTags()

    return res.status(200).json({
        status: 'success',
        data: allTags.map((tag) => transFormTag(tag))
    })
})

// UPDATE A TAG
const updateTag = catchAsync(async (req, res, next) => {
    const { tagId } = req.params
    const { content, title } = req.body

    const updatedTag = await tagService.updateTag(title, content, tagId)

    if (!updatedTag) {
        return next(new AppError('Tag does not exist', 404))
    }
    const data = transFormTag(updatedTag)
    return res.status(200).json({
        status: 'success',
        data
    })
})

// DELETE A TAG
const deleteTag = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const response = await tagService.deleteTag(id)
    if (!response.status === 'success')
        return next(new AppError('No tag with that Id', 404))

    return res.status(200).json({
        status: 'success',
        data: { message: 'Tag has been successfully deleted' }
    })
})

module.exports = {
    createNewTag,
    fetchTags,
    updateTag,
    deleteTag
}
