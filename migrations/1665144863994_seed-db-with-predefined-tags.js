
exports.shorthands = undefined

exports.up = (pgm) => {
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Life')`)
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Startup')`)
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Blockchain')`)
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Poetry')`)
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Life Lessons')`)
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Politics')`)
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Health')`)
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Love')`)
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Travel')`)
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Technology')`)
}

exports.down = false
