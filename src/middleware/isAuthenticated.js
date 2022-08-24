const passport = require('passport')

// access user info from req.user in follow-up function
module.exports = () => passport.authenticate('jwt', { session: false })
