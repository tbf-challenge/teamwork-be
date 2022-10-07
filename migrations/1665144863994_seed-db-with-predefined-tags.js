
exports.shorthands = undefined

exports.up = (pgm) => {
	pgm.sql(`INSERT into tags
            (title)
            VALUES ('Life'), ('Startup'),('Blockchain'),('Poetry'),
            ('Life Lessons'),('Politics'),('Health'),('Love'),
            ('Travel'),('Technology')`)
}

exports.down = false
