const {expect} = require('chai')
const { faker } = require('@faker-js/faker')
const db = require("../../db")
const createTag = require("./create-tag")
const { fixtures } = require('../../../test/utils')


describe('Create tag', () => {
	

	it('should return an error when tag already exists', async () => {

		const insertedTag = await fixtures.insertTag()

		return expect(createTag({
			title : insertedTag.title,
			content : insertedTag.content
		}))
			.to.be.rejectedWith('Tag already exists')
		
	})

	it('should insert a tag', async () => {
		const tag = await createTag({
			title : faker.random.words(),
			content : faker.random.words()
		})
		const insertedTag = await db.query(
			`SELECT * FROM tags
                WHERE id = $1
                
                `,[tag.id ])
		return expect(insertedTag.rowCount).to.equal(1)
    
	})

	it('should return right data', async () => {

		const tag = await createTag({
			title : faker.random.words(),
			content : faker.random.words()
		})

		const result = await db.query(
			`SELECT * FROM tags
                WHERE id = $1
                `,[tag.id ])
		const insertedTag = result.rows[0]

		return expect(tag).to.eql({
			id : insertedTag.id,
			title : insertedTag.title,
			content : insertedTag.content
		})
	})
})
