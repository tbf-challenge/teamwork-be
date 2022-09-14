const db = require("../db")

const insertQuery = async() => {
	await db.query(
		`INSERT INTO users
        ("firstName", "lastName", email, "passwordHash",
             gender, role, department, address, "jobRole")
         VALUES ('Jida', 'Asare', 'jakazzy@gmail.com',
         '$2b$10$YyFD0lR0usnySjxAtUoYx.xtHi4TKPsCRJ404To.VaWDc3S3ahLbq'
         ,'non-binary','admin','sales','KL 201','sales')
        `
	)

}

insertQuery()
