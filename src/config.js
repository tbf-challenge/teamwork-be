/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

if (!process.env.NODE_ENV) { process.env.NODE_ENV = 'development' }

if (process.env.NODE_ENV === 'development') { require('dotenv').config() }

module.exports = key => {
  const value = process.env[key]
  if (value === undefined) {
      throw new Error(`No config for env variable ${key}`)
  } else {
      return value
  }
}