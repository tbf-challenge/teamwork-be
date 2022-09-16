const { Strategy, ExtractJwt } = require('passport-jwt')
const { getUserByEmail } = require('../services/users')

const config = require('../config')

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config('TOKEN_SECRET')
}

module.exports = (passport) => {
	const verifyCallBack = async (jwtPayload, done) => {
		let user
		if(jwtPayload.user){
			const { email } = jwtPayload.user
			user = await getUserByEmail(email)
		}
		else {
			user = jwtPayload
		}
		if (user) {
			return done(null, user)
		}
		return done(null, false)
	}

	passport.use(new Strategy(options, verifyCallBack))
}
