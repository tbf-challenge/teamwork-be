/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
	pgm.addConstraint('posts_tags', 'post_and_tag_id', 
		{ unique: ['postId', 'tagId'] })
}

exports.down = false
