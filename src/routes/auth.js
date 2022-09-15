const express = require('express')
const userSevice = require('../services/users')
const validateSchema = require('../middleware/validateSchema')
const isAuthenticated = require('../middleware/isAuthenticated')
const isAdmin = require('../middleware/isAdmin')
const { catchAsync } = require('../lib')


const {
	authSchema,
	signinSchema,
	inviteUserSchema
} = require('../schema')

const router = express.Router()

const transformUserResponse = ({accessToken,
	userId,
	refreshToken}) => ({
	accessToken,
	userId,
	refreshToken
})


router.post(
	'/signin',
	validateSchema(signinSchema),
	catchAsync(async (req, res) => {
		const { email, password } = req.body

		const { accessToken, updatedRefreshToken, userId } = await userSevice
			.signInUserByEmail(email, password)

		return res.json({
			status: 'success',
			data: {
				...transformUserResponse({
					accessToken,
					refreshToken : updatedRefreshToken,
					 userId
				})
			}

		})
	})
)

router.post(
	'/invite-user',
	isAuthenticated(),
	isAdmin,
	validateSchema(inviteUserSchema),

	catchAsync(async (req, res) => {
		const { email } = req.body

		const { email:userEmail, status } = await userSevice.inviteUser(email)

		res.status(200).json({
			status: 'success',
			data: {
				email: userEmail,
				status
			}
		})
	})
)


router.post(
	'/create-user',
	isAuthenticated(),
	isAdmin,
	validateSchema(authSchema),
	catchAsync(async (req, res) => {
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


		const { accessToken, refreshToken, userId } = 
		await userSevice.createNewUser([
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
			status: 'success',
			data: {
				message: 'User account successfully created',
				...transformUserResponse(accessToken,refreshToken,userId)
			}
		})
	})
)

module.exports = router
