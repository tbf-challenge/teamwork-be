const {expect} = require('chai')
const { faker } = require('@faker-js/faker')
const updateTag = require("./update-tag")
const db = require('../../db')
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

	it('should update a tag', async () => {
		const { id } = tag
		
		await updateTag(
			updatedInfo.title, 
			updatedInfo.content,
			updatedInfo.tagId)

		const { rows } = await db.query(
			`SELECT * FROM tags
            WHERE id = $1
             `, [id])

		const  insertedTag = rows[0]

		return expect(insertedTag).to.eql({
			id : updatedInfo.tagId,
			title: updatedInfo.title,
			content: updatedInfo.content
		})
	})
	it('should return the right response tag', async () => {
			
		const updatedTag = await updateTag(
			updatedInfo.title, 
			updatedInfo.content, 
			updatedInfo.tagId)
            
		return expect(updatedTag).to.eql({
			id : updatedInfo.tagId,
			title: updatedInfo.title,
			content: updatedInfo.content
		})
    
	})
})