const chai = require('chai')
const verifyResetToken = require('./verifyPasswordResetToken')
const generateAccessToken = require('../generate-access-token')

const testEmail = 'testemail@gmail.com'

        
const { expect } = chai

describe('verifyPasswordResetToken', () => {
	it('should throw an error if the token is invalid', () => {
		const token = 'invalid-token'
		expect(() => verifyResetToken(token)).to.throw()
	})
})
describe('verifyPasswordResetToken', () => { 
	it('should return the decoded email if the token is valid', () => {
		const token = generateAccessToken(
			{ data: { email: testEmail }, 
				expiry: '1h' })
		const decodedEmail = 'testemail@gmail.com'
		expect(verifyResetToken(token).email).to.deep.equal(decodedEmail)
	})
})
