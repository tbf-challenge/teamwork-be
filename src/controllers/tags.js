// APLICATION LOGIC FOR TAGGING
const { catchAsync, AppError } = require('../lib')
const tagService = require('../services/tags')

/**
 * Destructure tag 
 * @param {object} tag - The tag object
 */
const transformTag = (tag) => {
	const data = {
		id: tag.id,
		title: tag.title,
		content: tag.content
	}
	return data
}

/** Controller for creating a new tag */ 
const createNewTag = catchAsync(async (req, res, next) => {
	const { content, title } = req.body
	const newTag = await tagService.createTag({ content, title })

	if (!newTag) return next(new AppError('Tag already exists', 400))
	const data = transformTag(newTag)

	return res.status(201).json({
		status: 'success',
		data
	})
})

/** Controller for fetching all tags */ 
const fetchTags = catchAsync(async (req, res) => {
	const allTags = await tagService.fetchTags()

	return res.status(200).json({
		status: 'success',
		data: allTags.map(transformTag)
	})
})

/** Controller for updating a tag */ 
const updateTag = catchAsync(async (req, res, next) => {
	const { tagId } = req.params
	const { content, title } = req.body

	const updatedTag = await tagService.updateTag(title, content, tagId)

	if (!updatedTag) {
		return next(new AppError('Tag does not exist', 404))
	}
	const data = transformTag(updatedTag)
	return res.status(200).json({
		status: 'success',
		data
	})
})

/** Controller for deleting a tag */ 
const deleteTag = catchAsync(async (req, res) => {
	const { id } = req.params

	await tagService.deleteTag(id)
	
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
