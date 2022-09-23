const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const { setupDB } = require('./utils')

chai.should()
chai.use(chaiAsPromised)

before(async () => {  
	await setupDB()
})