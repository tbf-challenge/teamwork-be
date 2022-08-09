/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

let config

 require('dotenv').config() // dynmically loading of require


try {
  config = require(`./${process.env}`)
} catch (error) {
  console.error(error)
  throw error
}

module.exports = env => {
  if (config[env] === undefined) {
    throw new Error(`No env variable ${env}. Update config`)
  }
  return config[env]
}