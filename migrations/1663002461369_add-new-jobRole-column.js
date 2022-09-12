/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
	pgm.addColumns('users', {jobRole: { type: 'varchar(20)', 
		notNull: false}} )
}

exports.down = false
