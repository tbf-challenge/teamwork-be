exports.shorthands = undefined

exports.up = pgm => {
	pgm.addColumns('users', { profilePictureUrl: { type: 'text'}} )
}

exports.down = false
