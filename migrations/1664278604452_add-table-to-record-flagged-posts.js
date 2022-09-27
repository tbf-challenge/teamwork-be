
exports.shorthands = undefined

exports.up = (pgm) => {
	pgm.createTable('post_flags', {
		userId: {
			type: 'integer',
			notNull: true,
			references: "users",
			onDelete: 'cascade'
		},
		postId: {
			type: 'integer',
			notNull: true,
			references: "posts",
			onDelete: 'cascade'
		},
		reason: { type: 'text' },
		createdAt: 'createdAt'
	}, {
		constraints: {
			primaryKey: ['userId', 'postId']
		}
	})
}

exports.down = false
