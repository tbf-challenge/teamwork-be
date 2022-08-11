// const express = require('express')
// const morgan = require('morgan')
// // const { Pool } = require('pg')
// //
// const db = require('../db')

// const router = express.Router()

// const app = express()

// // Middleware
// app.use(express.json())
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'))
// }

// // GET ALL ARTICLES
// app.get('/', (req, res) => {
//     res.send('Hello friend')
// })

// // GET A ARTICLE

// // CREATE A USER
// app.post('/user', async (req, res) => {
//     try {
//         const {
//             id,
//             firstName,
//             lastName,
//             email,
//             passwordHash,
//             gender,
//             jobRole,
//             department,
//             address,
//         } = req.body
//         const newUser = await db.query(
//             'INSERT INTO users ( id, firstName, lastName, email, passwordHash, gender, jobRole , department, address) VALUES ($1 , $2 , $3, $4, $5, $6, $7, $8, $9) RETURNING *',
//             [
//                 id,
//                 firstName,
//                 lastName,
//                 email,
//                 passwordHash,
//                 gender,
//                 jobRole,
//                 department,
//                 address,
//             ]
//         )
//         res.json(newUser)
//     } catch (err) {
//         console.error(err.message)
//     }
// })

// // CREATE an ARTICLE
// app.post('/article', async (req, res) => {
//     try {
//         const { id, title, image, content, published, authorId } = req.body
//         const newArticle = await db.query(
//             'INSERT INTO articles (id , title , image , content , published , authorId ) VALUES ($1 , $2 , $3 , $4 , $5 ,$6) RETURNING *',
//             [id, title, image, content, published, authorId]
//         )
//         res.json(newArticle)
//     } catch (err) {
//         console.error(err.message)
//     }
// })
// // UPDATE ARTICLES

// // DELETE ARTICLES

// // Routes
// app.use('api/v1', router)

// module.exports = app
