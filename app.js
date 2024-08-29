const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const phonebookRouter = require('./controllers/phonebookController')

const logger = require('./utils/logger')
const config = require('./utils/configs')

const middleware = require('./utils/middleware')
const mongoose = require('mongoose')


morgan.token('phonebook', (request, response) => {
  return JSON.stringify(request.body)
})

logger.info('Connecting to database')
mongoose.set('strictQuery',false)

mongoose.connect(config.MONGO_URI)
  .then( result =>
  {logger.info('Connected Successfully')})
  .catch( error =>
  {logger.info('Error Connection Failed:', error.message)})

const app = express()

app.use(express.static('dist'))
app.use(cors())

app.use(express.json())

app.use(morgan('Server running on port 3001'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :phonebook'))

app.use('/api/phonebook', phonebookRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
