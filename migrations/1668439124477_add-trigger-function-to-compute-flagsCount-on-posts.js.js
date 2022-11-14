
exports.shorthands = undefined

exports.up = (pgm) => {

	pgm.createFunction("computeFlags", [], {
		returns :"trigger",
		language : "plpgsql"
	},
	`DECLARE postFlag post_flags%ROWTYPE;
    BEGIN
     
       IF (TG_OP = 'DELETE') THEN
         postFlag = OLD;
       ELSIF (TG_OP = 'INSERT') THEN
         postFlag = NEW;
     END IF;
     UPDATE posts
     SET "flagsCount" = (
         SELECT COUNT(*) 
         FROM "post_flags"
         WHERE "postId" = postFlag."postId"
     )
     WHERE id = postFlag."postId";
     
     RETURN postFlag;
     
     END;`
	)

	pgm.createTrigger("post_flags","flagsTrigger",{
		when : "AFTER",
		operation : ["INSERT", "DELETE"],
		function : "computeFlags",
		level : "ROW"
	})
}

exports.down = false
