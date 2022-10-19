const {expect} = require('chai')
const db = require("../../db")
const fetchTags = require("./fetch-tags")
const {fixtures, resetDBTable} = require('../../../test/utils')

describe('Fetch all tags', () => {
	const numberOfTags = 5
	before(async () => {
		await resetDBTable('tags')
		await fixtures.insertMultipleTags(numberOfTags)
	 })
	it('should fetch tags', async () =>{
		const actualTags = await fetchTags()
		const result = await db.query(`
			SELECT * FROM tags`)
		return expect(actualTags).to.eql(result.rows)	
	})

})