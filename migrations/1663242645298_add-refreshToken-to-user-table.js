exports.shorthands = undefined

exports.up = pgm => {
	pgm.addColumns('users', { refreshToken: { type: 'varchar(100)', 
		allowNull: true }} )
}

exports.down = false