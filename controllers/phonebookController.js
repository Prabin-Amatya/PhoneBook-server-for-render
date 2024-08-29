const phonebookRouter = require('express').Router()
const phonebook = require('../models/phonebook')


phonebookRouter.get('/', (request, response) => {
  phonebook.find({}).then(contacts => response.json(contacts))
})

phonebookRouter.get('/:id', (request, response, next) => {
  phonebook.findById(request.params.id)
    .then(contact => {
      if(contact) response.json(contact)
      else {
        response.statusMessage = 'Contact of that id doesn\'t exist'
        response.status(404).end()
      }})
    .catch( error => next(error))
})


phonebookRouter.post('/', (request, response, next) => {
  phonebook.findOne({ name : request.body['name'] })
    .then(contact =>
    {
      console.log(contact)
      if(contact)  response.json({ error:'Csontact Already Exists' })
      else
      {
        const new_contact = new phonebook(request.body)
        new_contact
          .save()
          .then(contact =>
            response.json(contact))
          .catch(error => next(error))
      }
    })
})

phonebookRouter.put('/:id', (request, response) =>
{
  phonebook.findByIdAndUpdate(request.params.id, request.body, { runValidators:true ,context:'query' })
    .then(filler => response.json(request.body))

    .catch(filler => response.status(404).json({ error:'Invalid Id' }
    ))
})

phonebookRouter.delete('/:id', (request, response) =>
{
  const id = request.params.id
  phonebook.findByIdAndDelete(id).then(
    deletedContact =>
    {
      console.log('Contact Deleted Successfully')
      console.log(deletedContact)
      response.json(deletedContact)
    })
})

module.exports = phonebookRouter