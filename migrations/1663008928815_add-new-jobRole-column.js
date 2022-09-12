/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
	pgm.addColumns('users', { jobRole: { type: 'varchar(100)', 
		allowNull: true }} )
}

exports.down = false
