const customError = ({name, message}) => {
	const err = new Error(message)
	err.name =  name
	return err
}

module.exports = customError