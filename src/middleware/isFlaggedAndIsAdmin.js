const isAdmin = require("./isAdmin")

module.exports = (req, res, next) => {
	if (req.query.isFlagged) {
	 return	isAdmin(req, res, next)
	} 
	return next()
}