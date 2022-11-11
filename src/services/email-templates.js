module.exports = {
	getInviteUserMailSubjectAndBody : ({ organizationName , inviteUrl }) => ({
		subject: `Invitation to join the 
    ${organizationName} organization`,
		text: `Hi,
	\n\nPlease click on the following link to complete your registration:
	\n${inviteUrl}\n\nIf you did not request this, please ignore this email.\n`
	})
}