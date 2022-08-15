const express = require('express')
const morgan = require('morgan')

const router = require('./routes')

const db = require('./db')

const app = express()

// Middleware
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.get('/', (req, res) => {
    res.send('Hello friend')
})

// CREATE USER ENDPOINT

app.post('/users', async (req, res) => {
    try {
        const {
            id,
            firstName,
            lastName,
            email,
            passwordHash,
            gender,
            jobRole,
            department,
            address,
            createdAt,
        } = req.body
        const newUser = await db.query(
            'INSERT INTO users ( id, "firstName" , "lastName" , email, "passwordHash" , gender , "jobRole" , department, address, "createdAt" ) VALUES ($1 , $2 , $3, $4, $5, $6, $7, $8, $9 , $10) RETURNING *',
            [
                id,
                firstName,
                lastName,
                email,
                passwordHash,
                gender,
                jobRole,
                department,
                address,
                createdAt,
            ]
        )
        res.json(newUser)
    } catch (err) {
        console.error(err.message)
    }
})

//  CREATE POST ENDPOINT

app.post('/article', async (req, res) => {
    try {
        const { id, userId, title, image, content, published, createdAt } =
            req.body
        const newArticle = await db.query(
            'INSERT INTO posts (id , "userId" , title , image , content , published , "createdAt") VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7) RETURNING *',
            [id, userId, title, image, content, published, createdAt]
        )
        res.json(newArticle)
    } catch (err) {
        console.error(err.message)
    }
})
// Routes
app.use('/api/v1', router)

module.exports = app
