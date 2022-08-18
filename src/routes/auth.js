const express = require('express')
const userSevice = require('../services/users')
const validateSchema = require('../middleware/validateSchema')

const validateRequest = validateSchema(true)

const router = express.Router()

router.post(
	'/signin',
	validateRequest, 
	async (req, res) => {
		const{ email, password } = req.body

		const { token, userId } = await userSevice
			.signInUserByEmail(email, password)
		
		return res.json({
			status: 'success',
			data: {
				token,
				userId
			}

		})
	})

router.post('/create-user',
	validateRequest, 
	async (req, res) => {
		const {
			firstName,
			lastName,
			email,
			password,
			gender,
			jobRole,
			department,
			address
		} = req.body

   
		const { token, userId } = await userSevice.createNewUser([
			firstName, 
			lastName,
			email, 
			password, 
			gender, 
			jobRole, 
			department,
			address
		])

		
		return res.status(201).json({
			status: "success",
			data: {
				message: "User account successfully created",
				token,
				userId
			}
		})

	})

module.exports = router
