const app = require('./app')
const log = require('./lib/logger')()


const port = process.env.PORT || 3000
app.listen(port, () => {
    log.info(`App running on port ${port}...`)
})
