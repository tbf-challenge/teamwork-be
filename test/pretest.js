const { setupDB } = require('./utils')

before(async () => {  
	await setupDB()
})