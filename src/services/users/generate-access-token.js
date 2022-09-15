const jwt = require("jsonwebtoken")
const config = require("../../config")


const generateAccessToken = ({data , expiry}) => {
	const accessToken = jwt.sign( data , config("TOKEN_SECRET"),
		{expiresIn: expiry})
	return accessToken
}

module.exports = generateAccessToken