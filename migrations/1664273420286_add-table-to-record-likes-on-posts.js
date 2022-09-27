

exports.shorthands = undefined

exports.up = (pgm) => {
	pgm.createTable('post_likes', {
		userId: {
			type: 'integer',
			notNull: true,
			references: '"users"',
			onDelete: 'cascade',
			primaryKey: true
		},
		postId: {
			type: 'integer',
			notNull: true,
			references: '"posts"',
			onDelete: 'cascade',
			primaryKey: true
		},
		createdAt: 'createdAt'
	})
}

exports.down = false
