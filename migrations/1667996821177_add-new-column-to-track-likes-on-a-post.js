exports.shorthands = undefined

exports.up = pgm => {
	pgm.addColumns('posts', { likesCount: {
		type: 'integer', 
		default: 0
	}} )
}

exports.down = false