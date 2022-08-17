const { PgLiteral } = require('node-pg-migrate')
// todo  add updated at shorthand

exports.shorthands = {
    createdAt: {
        type: 'timestamp',
        notNull: true,
        default: new PgLiteral('current_timestamp'),
    },
}

exports.up = (pgm) => {
    pgm.createTable('users', {
        id: 'id',
        firstName: { type: 'varchar(1000)', notNull: true },
        lastName: { type: 'varchar(1000)', notNull: true },
        email: { type: 'varchar(100)', notNull: true },
        passwordHash: { type: 'varchar(100)', notNull: true },
        gender: { type: 'varchar(100)', notNull: true },
        jobRole: { type: 'varchar(100)' },
        department: { type: 'varchar(100)', notNull: true },
        address: { type: 'varchar(1000)', notNull: true },
        createdAt: 'createdAt',
    })

    pgm.createTable('posts', {
        id: 'id',
        userId: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        title: { type: 'text', notNull: true },
        image: { type: 'text' },
        content: { type: 'text', notNull: true },
        published: { type: 'boolean' },
        createdAt: 'createdAt',
    })

    pgm.createTable('comments', {
        id: 'id',
        userId: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'cascade',
        },
        postId: {
            type: 'integer',
            notNull: true,
            references: '"posts"',
            onDelete: 'cascade',
        },
        content: { type: 'text', notNull: true },
        published: { type: 'boolean' },
        createdAt: 'createdAt',
    })

    pgm.createTable('tags', {
        id: 'id',
        content: { type: 'text', notNull: true },
        title: { type: 'text', notNull: true },
    })

    pgm.createTable('posts_tags', {
        postId: {
            type: 'integer',
            notNull: true,
            references: '"posts"',
            onDelete: 'cascade',
        },
        tagId: {
            type: 'integer',
            notNull: true,
            references: '"tags"',
            onUpdate: 'cascade',
            onDelete: 'cascade',
        },
        content: { type: 'text', notNull: true },
        title: { type: 'text', notNull: true },
    })
    pgm.createIndex('posts', 'userId')
}

exports.down = false
