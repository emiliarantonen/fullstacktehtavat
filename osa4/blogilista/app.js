const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter =require('./controllers/blog')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
logger.info('conncting to', url)
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use('/api/blogs', blogRouter)


module.exports=app
