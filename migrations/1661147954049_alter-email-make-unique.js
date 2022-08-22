exports.up = pgm => {
	pgm.addConstraint( 'users', 'email_unique', { unique: ['email']} )
}
