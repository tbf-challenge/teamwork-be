/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const pg = require('pg')
const format = require('pg-format')
const { faker } = require('@faker-js/faker')

const args = require('minimist')(process.argv.slice(2))

const numberOfusersToBeGenerated = args || 10

const users = []

const createNewUser = () => ([
	faker.datatype.uuid(),
	faker.name.firstName(),
	faker.name.lastName(),
	faker.internet.email(),
	faker.internet.password(),
	faker.helpers.arrayElement(['male', 'female']),
	faker.helpers.arrayElement(['admin', 'user']),
	faker.helpers
		.arrayElement(['marketting', 'finance', 'sales', 'technology']),
	faker.address(),
	faker.date.past(),
	faker.date.past()
])

Array.from({ length: numberOfusersToBeGenerated }).forEach(() => {
	users.push(createNewUser())
})

// eslint-disable-next-line max-len
const addUsersQuery = format('INSERT INTO users (first_name, last_name, email, password_hash, gender, job_role, department, address, created_at, updated_at) VALUES %L returning id', users)

async function run() {
	let client
	try {
		client = new pg.Client({
			connectionString: 'postgresql://localhost/node_example'
		})
		await client.connect()
		const { rows } = await client.query(addUsersQuery)
		console.log(rows)
	} catch (e) {
		console.error(e)
	} finally {
		client.end()
	}
}

run()
