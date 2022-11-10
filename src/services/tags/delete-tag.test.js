const {expect} = require('chai')
const db = require("../../db")
const deleteTag = require("./delete-tag")
const {fixtures} = require('../../../test/utils')

describe('DELETE tag', () => {
	let tag
	before(async ()=>{
		tag = await fixtures.insertTag()  
	})
	it('should delete a tag', async () => {
		await deleteTag(tag.id)
		const queryTag = await db.query(
			`SELECT * FROM tags
                WHERE id = $1`,[tag.id])
		expect(queryTag.rowCount).to.equal(0)
    
	})
        
})
