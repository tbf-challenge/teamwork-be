/* eslint-disable camelcase */
const LocalStrategy = require('passport-local')
const db = require('../db')

const options = {
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}

module.exports = ( passport ) => {
    const loginVerifyCallBack = (email, password, done) => {
        db.findOne({ email },  (err, user)=> {
          if (err) { return done(err, false) }
          if (!user) { return done(null, false); }
          if (!user.verifyPassword(password)) { return done(null, false); }
          return done(null, user);
        });
      }

    passport.use(
      'local-login', new LocalStrategy(options, loginVerifyCallBack))
}
