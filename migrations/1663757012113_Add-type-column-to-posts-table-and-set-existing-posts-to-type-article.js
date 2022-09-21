exports.shorthands = undefined

exports.up = (pgm) => {
	pgm.createType( 'post_type' , ['article', 'gif'])
	pgm.addColumns('posts', { type : { type: 'post_type'}} )
	pgm.sql(`
	UPDATE posts 
	SET type = 'article'
	WHERE type IS NULL 
	`
	)
	pgm.alterColumn('posts', 'type', { notNull: true })
}

exports.down = false