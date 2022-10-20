const { expect } = require('chai')
const { faker } = require('@faker-js/faker')
const db = require('../../db')
const {fixtures} = require('../../../test/utils')
const updatePost = require('./update-post')


describe('Update Article', () => {
	let user
	let article
	let updatedInfo = {}

	beforeEach(async () => {
		user = await fixtures.insertUser()
		article = await fixtures.insertPost({
			userId : user.id,
			type : 'article'
		})
		updatedInfo = {
			title : faker.random.word(),
			image : faker.image.imageUrl(),
			content : faker.random.words(),
			published : faker.datatype.boolean()
		}
	})

	it('should throw an error if article does not exist', async () => {
		const { id , type} = article
		 await db.query(
			`DELETE FROM posts
	         WHERE id = $1
	         AND type = $2`, [id,type])
		return expect(updatePost({...updatedInfo, id}))
			.to.be.rejectedWith(
				'Article does not exist')
	})

	it('should update article', async () => {
		const { id , type} = article
		await updatePost({...updatedInfo, id})

		const { rows } = await db.query(
			`SELECT * FROM posts
             WHERE id = $1
             AND type = $2`, [id,type])

		const  updatedPost = rows[0]

		return expect(updatedPost).to.include({
			title: updatedInfo.title,
			image: updatedInfo.image,
			content: updatedInfo.content,
			published: updatedInfo.published
		})

	})

})