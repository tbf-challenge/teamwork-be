
exports.shorthands = undefined

exports.up = (pgm) => {

	pgm.createFunction("computeLikes", [], {
		returns :"trigger",
		language : "plpgsql"
	},
	`DECLARE postLike post_likes%ROWTYPE;
    BEGIN
     
       IF (TG_OP = 'DELETE') THEN
         postLike = OLD;
       ELSIF (TG_OP = 'INSERT') THEN
         postLike = NEW;
     END IF;
     UPDATE posts
     SET "likesCount" = (
         SELECT COUNT(*) 
         FROM "post_likes"
         WHERE "postId" = postLike."postId"
     )
     WHERE id = postLike."postId";
     
     RETURN postLike;
     
     END;`
	)

	pgm.createTrigger("post_likes","likesTrigger",{
		when : "AFTER",
		operation : ["INSERT", "DELETE"],
		function : "computeLikes",
		level : "ROW"
	})
}

exports.down = false
