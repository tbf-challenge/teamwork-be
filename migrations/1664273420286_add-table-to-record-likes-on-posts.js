

exports.shorthands = undefined

exports.up = (pgm) => {
	pgm.createTable('post_likes', {
		id: 'id',
		userId: {
			type: 'integer',
			notNull: true,
			references: '"users"',
			onDelete: 'cascade'
		},
		postId: {
			type: 'integer',
			notNull: true,
			references: '"posts"',
			onDelete: 'cascade'
		},
		createdAt: 'createdAt'
	})
}

exports.down = false
