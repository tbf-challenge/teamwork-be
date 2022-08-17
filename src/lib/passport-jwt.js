/* eslint-disable camelcase */
const { Strategy, ExtractJwt } = require('passport-jwt')
const db = require('../db')
const config = require('../config')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:config('SECRET')
}

module.exports = ( passport ) => {
    const verifyCallBack = (jwt_payload, done) => {
        
        db.findOne({id: jwt_payload.sub}, (err, user) =>{
            if (err) {
                return done(err, false)
            }
            if (user) {
                return done(null, user)
            } 
                return done(null, false)
                // or you could create a new account        
        })
    }
    
    passport.use(new Strategy(options, verifyCallBack))
}

