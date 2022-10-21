const {  
	verifyPassword 
} = require("../../lib")
const { AppError } = require("../../lib")
const generateAccessToken = require("./generate-access-token")
const generateRefreshToken = require("./generate-refresh-token")
const updateRefreshToken = require("./update-refresh-token")
const getUserByEmail = require('./get-user-by-email')

const invalidEmailAndPassword = "Invalid email or password."

const signInUserByEmail = async (email, password) => {
	const user = await getUserByEmail(email)
	const isPasswordSame = await verifyPassword(password, user.passwordHash)
	if (!isPasswordSame) {
		throw new AppError(invalidEmailAndPassword, 401)
	}
	const body = { id: user.id, email: user.email }
	const accessToken =  generateAccessToken({
		data: {user : body}, 
		expiry : '15m'
	})
	
	const refreshToken = await generateRefreshToken()
	const updatedUser = await updateRefreshToken(refreshToken , user.id)
	return { accessToken, user: updatedUser }
}
module.exports = signInUserByEmail