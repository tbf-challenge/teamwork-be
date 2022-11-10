/* add new column to track number of times a post has been flagged */

exports.shorthands = undefined

exports.up = pgm => {
	pgm.addColumns('posts', { flagsCount: {
		type: 'integer', 
		default: 0
	}} )
}

exports.down = false