exports.shorthands = undefined

exports.up = pgm => {
	pgm.addColumns('posts', { flagsCount: {
		type: 'integer', 
		default: 0
	}} )
}

exports.down = false