exports.shorthands = undefined

exports.up = (pgm) => {
	pgm.createTable('post_likes', {
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
	}, {
		constraints: {
			primaryKey: ['userId', 'postId']
		}
	})
}
    

exports.down = false
