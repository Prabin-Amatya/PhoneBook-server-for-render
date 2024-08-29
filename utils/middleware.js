const logger = require('../utils/logger')

const errorHandler = (error, request, response, next) =>
{
  logger.error(error)
  if(error.name === 'CastError')
    return response.status(400).send({ error:'Malformatted Id' })
  else if(error.name === 'ValidationError'){
    const message = error.errors
    const message_array = [message.name.message, message.number.message]
    response.status(400).json({ error: message_array })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'Endpoint Doesn\'t Exist' })
}

module.exports = {
  errorHandler,
  unknownEndpoint
}