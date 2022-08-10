const express = require('express')
const morgan = require('morgan')

// TO DO - add compression to the project 
//  require('compression')
const router = require('./routes')

const app = express()

// Middleware
app.use(express.json())
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.get('/', (req, res) => {
    res.send('Hello friend')
})

// Routes
app.use('api/v1', router)

module.exports = app
