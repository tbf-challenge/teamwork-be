exports.shorthands = undefined

exports.up = pgm => {
	pgm.alterColumn('users', 'gender', { notNull: false })
	pgm.alterColumn('users', 'jobRole', { notNull: false })
	pgm.alterColumn('users', 'department', { notNull: false })
	pgm.alterColumn('users', 'address', { notNull: false })
}

exports.down = false