const express = require('express')
const userSevice = require('../../services/users')
const validateSchema = require('../../middleware/validateSchema')
const isAuthenticated = require('../../middleware/isAuthenticated')
const isAdmin = require('../../middleware/isAdmin')
const { catchAsync , AppError} = require('../../lib')


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

const transformUserResponse = (userDetails) => ({
	accessToken : userDetails.accessToken,
	userId : userDetails.userId,
	refreshToken : userDetails.refreshToken
})
const transformUserInformationResponse = (user) => ({
	firstName: user.firstName,
	lastName: user.lastName,
	email: user.email,
	gender: user.gender,
	role: user.role,
	department: user.department,
	address: user.department,
	jobRole: user.jobRole,
	createdAt : user.createdAt

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
			data:{
			   ...transformUserResponse(userDetails),
				...transformUserInformationResponse(userDetails.user)
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
	validateSchema(authSchema),
	isValidInvite,
	catchAsync(async (req, res) => {
		const {
			firstName,
			lastName,
			email,
			password
		} = req.body


		const userDetails = 
		await userSevice.createNewUser({
			firstName,
			lastName,
			email,
			password
		})


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

router.get(
	'/invites/:token',
	catchAsync(async (req, res) => {
		const {
			token 
		} = req.params
		const userDetails = 
		await userSevice.getInvitedUserDetail(
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

		await userSevice.sendPasswordResetLink(email)

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
		
		await userSevice.resetPassword({ token, newPassword })
		
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
