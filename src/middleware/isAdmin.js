
module.exports = (req, res, next) => {
	if (req.user.jobRole !== 'admin'){
		return res.status(403).json({
			status: 'failed',
			message: 'Only admin can create users'
		})
	}
	
	return next()
}