const jwt = require('jsonwebtoken')
const { 
	genPasswordHash, 
	verifyPassword
} = require('../lib')

const config = require('../config')
const db = require('../db')
const { AppError } = require('../lib')

const invalidEmailAndPassword = 'Invalid email or password.'
const createNewUser = async(user) => {
	const [
		firstName, 
		lastName, 
		email, 
		password, 
		gender, 
		jobRole, 
		department, 
		address 
	] = user
	const passwordHash =  await genPasswordHash(password)
	// eslint-disable-next-line max-len
	const { rows, error } = await db.query('INSERT INTO users ("firstName", "lastName", "email", "passwordHash", "gender", "jobRole", "department", "address") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', 
		[
			firstName, 
			lastName,
			email,
			passwordHash,
			gender,
			jobRole,
			department,
			address
		])

	if (error) { throw error }
	const userProfile = rows[0]
	const body = { id: userProfile.id, email: userProfile.email }
	const token = jwt.sign({ user: body }, config('TOKEN_SECRET'))

	return { token, userId: userProfile.id }
}

const getUserByEmail = async (email) => {
	const { rows, error } = await db
		.query('SELECT * FROM users WHERE email = $1', [ email ])
	
	if (error){ throw error }
	const userProfile = rows[0]

	if (!userProfile){
		throw new AppError(invalidEmailAndPassword, 401)
	}
		
	const user = userProfile
	return user	
}

const signInUserByEmail = async (email, password) => {
	const user = await getUserByEmail(email)
	
	const isPasswordSame = await verifyPassword(password, user.passwordHash) 
	if(!isPasswordSame){ 
		throw new AppError(invalidEmailAndPassword, 401)
	}

	const body = { id: user.id, email: user.email }
	const token = jwt.sign({ user: body }, config('TOKEN_SECRET'))

	return { token, userId: user.id }
}


module.exports ={
	createNewUser,
	getUserByEmail,
	signInUserByEmail
}