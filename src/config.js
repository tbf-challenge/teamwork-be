'use strict'
let config

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

// load the .env file for local development
if (process.env.NODE_ENV === 'development') require('dotenv').config() // dynmically loading of require

if (!process.env.PROCESS_TYPE) throw new Error('"PROCESS_TYPE" is required')

try {
  config = require(`./${process.env.PROCESS_TYPE}`)
} catch (error) {
  console.error(error)
  if (error.code === 'MODULE_NOT_FOUND') {
    throw new Error(`No config for process type ${process.env.PROCESS_TYPE}`)
  }
  throw error
}

module.exports = env => {
  if (config[env] === undefined) {
    throw new Error(`No config for env variable ${env}`)
  }
  return config[env]
}