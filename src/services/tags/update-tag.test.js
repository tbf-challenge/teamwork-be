const {expect} = require('chai')
const { faker } = require('@faker-js/faker')
const updateTag = require("./update-tag")
const {fixtures} = require('../../../test/utils')


describe('Update Tag', () => {
	
	let tag
	let updatedInfo 

	before(async () => {
		tag = await fixtures.insertTag() 
		updatedInfo = {
			tagId : tag.id,
			title : faker.random.word(5),
			content: faker.random.words()
		}
	})

	it('should throw an error if tag does not exist', async () => 
		
		 expect(updateTag({updatedInfo, tagId: 230}))
			.to.be.rejectedWith(
				'Tag does not exist')
	)

	it('should update tag', async () => {
		// eslint-disable-next-line max-len
		const updatedTag = await updateTag(updatedInfo.title, updatedInfo.content, updatedInfo.tagId)
		
		return expect(updatedTag).to.eql({
			id : updatedInfo.tagId,
			title: updatedInfo.title,
			content: updatedInfo.content
		})

	})

})