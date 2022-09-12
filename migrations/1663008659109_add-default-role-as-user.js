/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
	pgm.alterColumn( 'users', 'role', { default: 'user'})
}

exports.down = false
