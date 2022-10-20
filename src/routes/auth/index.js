const express = require('express')
const userService = require('../../services/users')
const validateSchema = require('../../middleware/validateSchema')
const isAuthenticated = require('../../middleware/isAuthenticated')
const isAdmin = require('../../middleware/isAdmin')
const { catchAsync , AppError} = require('../../lib')
const { transformUserResponse } = require('../common/transformers')


const {
	RefreshTokenIsInvalidError,
	InvalidInviteError,
	InviteEmailDoesNotExistError,
	UserAlreadyExistsError,
	InvalidResetEmail,
	InvalidResetTokenError
} = require("../../services/errors")

const isValidInvite = require('../../middleware/isValidInvite')


const {
	authSchema,
	signinSchema,
	inviteUserSchema,
	authTokenSchema,
	updatePasswordSchema
} = require('../../schema')

const router = express.Router()
const ERROR_MAP = {
	[ RefreshTokenIsInvalidError.name ] : 401,
	[ InvalidInviteError.name ]  : 401,
	[ InviteEmailDoesNotExistError.name ] : 403,
	[ UserAlreadyExistsError.name ] : 422,
	[ InvalidResetEmail.name ] : 401,
	[ InvalidResetTokenError.name ] : 401
}

const transformUserCredentials = (userDetails) => ({
	accessToken : userDetails.accessToken,
	userId : userDetails.userId,
	refreshToken : userDetails.refreshToken
})


router.post(
	'/signin',
	validateSchema(signinSchema),
	catchAsync(async (req, res) => {
		const { email, password } = req.body

		const userDetails = await userService
			.signInUserByEmail(email, password)
		return res.json({
			status: 'success',
			data:{
			   ...transformUserResponse(userDetails.user),
			   refreshToken: userDetails.user.refreshToken,
			   createdAt : userDetails.user.createdAt,
			   accessToken : userDetails.accessToken
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

		const { email:userEmail, status } = await userService.inviteUser(email)

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
	isValidInvite,
	catchAsync(async (req, res) => {
		const {
			firstName,
			lastName,
			email,
			password,
			profilePictureUrl
		} = req.body


		const userDetails = 
		await userService.createNewUser({
			firstName,
			lastName,
			email,
			password,
			profilePictureUrl
		})


		return res.status(201).json({
			status: 'success',
			data: {
				message: 'User account successfully created',
				...transformUserCredentials(userDetails)
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

		const userDetails = await userService.getNewTokens(
			email,
			currentRefreshToken
		)

		res.status(200).json({
			status: 'success',
			data: transformUserCredentials(userDetails)
			
		})
	})
)

router.get(
	'/invites/:token',
	catchAsync(async (req, res) => {
		const {
			token 
		} = req.params
		const userDetails = 
		await userService.getInvitedUserDetail(
			token
		)

		return res.status(200).json({
			status: 'success',
			data: {
				email : userDetails.email,
				accessToken : userDetails.accessToken
			}
		})
	})
)

router.post('/password',

	catchAsync(async (req, res) => {
		const { email } = req.body

		await userService.sendPasswordResetLink(email)

		return res.status(200).json({
			status: 'success',
			data: {
				message: 'Password reset email sent'
			}
		})
	})
)

router.patch(
	'/password/:token',
	validateSchema(updatePasswordSchema),
	catchAsync(async (req, res) => {
		const { token } = req.params
		const { newPassword } = req.body
		
		await userService.resetPassword({ token, newPassword })
		
		return res.status(200).json({
			status: "success",
			data: {
				message: "Password has been reset"
			}
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
