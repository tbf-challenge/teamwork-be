exports.shorthands = undefined

exports.up = pgm => {
	pgm.addConstraint('tags', 'title_unique', 
		{ unique: ['title'] })
}

exports.down = false