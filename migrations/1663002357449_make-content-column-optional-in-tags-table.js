exports.shorthands = undefined

exports.up = pgm => {
	pgm.alterColumn('tags', 'content', { notNull: false })
}

exports.down = false