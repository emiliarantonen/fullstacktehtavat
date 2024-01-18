require('dotenv').config()
const logger = require('./logger')

let PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

logger.info(PORT)
logger.info(MONGODB_URI)

module.exports = {
  MONGODB_URI,
  PORT
}