const app = require('./app')
const logger = require('./lib/logger')

const  log = logger()

const port = process.env.PORT || 3000
app.listen(port, () => {
    log.info(`App running on port ${port}...`)
})
