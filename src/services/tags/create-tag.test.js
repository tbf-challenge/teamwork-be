const {expect} = require('chai')
const { faker } = require('@faker-js/faker')
const db = require("../../db")
const createTag = require("./create-tag")
const { fixtures } = require('../../../test/utils')


describe('Create tag', () => {
	
	let tag
	before(async ()=>{
		  
		 tag = await createTag({
			title : faker.random.word(5),
			content : faker.random.words()
		})
		 
	})

	it('should return an error when tag already exists', async () => {

		const insertedTag = await fixtures.insertTag()
		
		return expect(createTag(insertedTag))
			.to.be.rejectedWith('Tag already exists')
		
	})

	it('should insert a tag', async () => {

		const insertedTag = await db.query(
			`SELECT * FROM tags
                WHERE id = $1
                
                `,[tag.id ])
		expect(insertedTag.rowCount).to.equal(1)
    
	})

	it('should return right data', async () => {

		const result = await db.query(
			`SELECT * FROM tags
                WHERE id = $1
                `,[tag.id ])
		const insertedTag = result.rows[0]

		expect(tag).to.eql({
			id : insertedTag.id,
			title : insertedTag.title,
			content : insertedTag.content
		})
	})
})
