const chalk= require('chalk')

const error = chalk.bold.red
const warn = chalk.hex('#FFA500') // Orange color
const info = chalk.bold.blue

/* eslint-disable no-console */
const log = () => ({
    error(message){
        console.log(error(message))
    },

    warn(message){
        console.log(warn(message))
    },

    info(message){
        console.info(info(message))
    }
 })

module.export = log