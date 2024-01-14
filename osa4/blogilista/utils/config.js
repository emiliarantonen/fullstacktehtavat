require('dotenv').config()
const logger = require('./logger')

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

logger.info(PORT)
logger.info(MONGODB_URI)

module.exports = {
  MONGODB_URI,
  PORT
}