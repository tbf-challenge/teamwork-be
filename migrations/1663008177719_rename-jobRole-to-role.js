exports.shorthands = undefined

exports.up = pgm => {
	pgm.renameColumn( 'users', 'jobRole', 'role' )
}

exports.down = false
