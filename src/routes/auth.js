const express = require('express')
const userSevice = require('../services/users')
const validateSchema = require('../middleware/validateSchema')
const isAuthenticated = require('../middleware/isAuthenticated')
const isAdmin = require('../middleware/isAdmin')
const { catchAsync , AppError} = require('../lib')
const {
	refreshTokenIsInvalidError,
	inviteEmailDoesNotExistError,
	userAlreadyActivatedError
} = require("../services/errors")
const verifyCreateToken = require('../middleware/verifyInviteToken')


const {
	authSchema,
	signinSchema,
	inviteUserSchema,
	authTokenSchema
} = require('../schema')

const router = express.Router()
const ERROR_MAP = {
	[ refreshTokenIsInvalidError.name ] : 401,
	[ inviteEmailDoesNotExistError.name ] : 403,
	[ userAlreadyActivatedError.name ] : 400
}

const transformUserResponse = (userDetails) => ({
	accessToken : userDetails.accessToken,
	userId : userDetails.userId,
	refreshToken : userDetails.refreshToken
})


router.post(
	'/signin',
	validateSchema(signinSchema),
	catchAsync(async (req, res) => {
		const { email, password } = req.body

		const userDetails = await userSevice
			.signInUserByEmail(email, password)

		return res.json({
			status: 'success',
			data: transformUserResponse(userDetails)
			

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
	validateSchema(authSchema),
	verifyCreateToken,
	catchAsync(async (req, res) => {
		const {
			firstName,
			lastName,
			email,
			password
		} = req.body


		const userDetails = 
		await userSevice.createNewUser([
			firstName,
			lastName,
			email,
			password
		])


		return res.status(201).json({
			status: 'success',
			data: {
				message: 'User account successfully created',
				...transformUserResponse(userDetails)
			}
		})
	})
)

router.post(
	'/token',
	validateSchema(authTokenSchema),

	catchAsync(async (req, res) => {
		const { 
			email ,  
			refreshToken : currentRefreshToken 
		 } = req.body

		const userDetails = await userSevice.getNewTokens(
			email,
			currentRefreshToken
		)

		res.status(200).json({
			status: 'success',
			data: transformUserResponse(userDetails)
			
		})
	})
)

router
	.use((err, req, res, next)=> {
		const error = err
		error.success = false
		if(ERROR_MAP[error.name] ){
			next(new AppError( error.message ,ERROR_MAP[error.name] ))
			
		} 
		next(err)
	})

module.exports = router
