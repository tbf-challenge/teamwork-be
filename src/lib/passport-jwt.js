/* eslint-disable camelcase */
const { Strategy, ExtractJwt } = require('passport-jwt')
const { getUserByEmail } = require('../services/users')

const config = require('../config')

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey:config('SECRET')
}

module.exports = ( passport ) => {
	const verifyCallBack =  async (jwt_payload, done) => {
		const { email } = jwt_payload.user
		const user = await getUserByEmail(email)
        
		if (user) {
			return done(null, user)
		} 
		return done(null, false)
			       
		
	}
    
	passport.use(new Strategy(options, verifyCallBack))
}

