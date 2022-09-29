const request = require('supertest')
// const {expect} = require('chai')
// const db = require("../../db")
const {fixtures} = require('../../../test/utils')
const app = require('../../app')

describe('UNLIKE /gif', () => {
	let user

	before(async ()=>{
		 user = await fixtures.insertUser() 
	})
		 
	it('should unlike a gif image', async() => {
		const post = await fixtures.insertPost({
			userId : user.id , 
			type : 'gif'
		})
		    
		await fixtures.insertPostLike({userId : user.id , postId : post.id})
		// const result = await db.query(
		// 	`SELECT * FROM post_likes
		//      WHERE "userId" = $1
		//      AND "postId" = $2`,[ user.id, post.id ])
		// expect(result.rowCount).to.eql(0)	 
		const accessToken = await fixtures.generateAccessToken({data : user})
		return request(app)
			.delete(`/api/v1/gifs/${post.id}/likes/${user.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.set('Accept', 'application/json')
			// .expect('Content-Type', /json/)
			.expect(200)
			// eslint-disable-next-line consistent-return
			// .end((err) => {
			// 	if (err) 
			// 		return err
			// })
		
	})

})