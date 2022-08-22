/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
    pgm.dropColumns('posts_tags', ['title', 'content'], { isExists: true })
}

exports.down = false
