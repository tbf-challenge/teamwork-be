const db = require("../db")

const insertQuery = async() => {
	await db.query(
		`INSERT INTO users
        ("firstName", "lastName", email, "passwordHash",
             gender, role, department, address, "jobRole")
         VALUES ('Jida', 'Asare', 'jakazzy@gmail.com',
         'passwordHash','non-binary','admin','sales','KL 201','sales')
        `
	)

}

insertQuery()
