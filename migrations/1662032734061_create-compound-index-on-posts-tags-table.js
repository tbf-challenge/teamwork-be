/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => { pgm.createIndex('posts_tags', ['postId', 'tagId']) }

exports.down = false
