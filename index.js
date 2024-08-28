require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const phonebook = require("./models/phonebook")

const errorHandler = (error, request, response, next) =>
{
  console.log(error)
  if(error.name === 'CastError')
      return response.status(400).send({error:"Malformatted Id"})
  else if(error.name === 'ValidationError')
      {
        const message = error.errors
        const message_array = [message.name.message, message.number.message]
        response.status(400).json({ error: message_array })
      }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Endpoint Doesn't Exist" });
}

//database
const app = express()


morgan.token("phonebook", (request, response) =>
{
  return JSON.stringify(request.body)
}
)

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan('Server running on port 3001'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :phonebook'))

app.get('/', (request, response)=> 
        response.send("<h1>Hello World</h1>"))

app.get('/api/phonebook', (request, response)=> 
{
  phonebook.find({}).then(contacts => 
  response.json(contacts))
})


app.get('/api/phonebook/:id', (request, response)=> 
{
    phonebook.findById(request.params.id)
    .then(contact=>
      {  
        if(contact) response.json(contact)
        else     
        {
            response.statusMessage = "Contact of that id doesn't exist"
            response.status(404).end()
        }})
          .catch(error=>next(error))
})


app.get('/api/info', (request, response)=>
{
    const numberOfContact = phonebook["phonebook"].length
    const date = new Date().toString()
    const DisplayNumber = `<p>Phonebook has info for ${numberOfContact} people</p>`
    response.send(DisplayNumber+date)
})


app.post('/api/phonebook', (request, response, next)=> 
{
    phonebook.findOne({name : request.body["name"]})
    .then(contact=>
    {
      console.log(contact)
      if(contact)  response.json({error:"Csontact Already Exists"})
      
      else
      {
        const new_contact = new phonebook(request.body)
        new_contact
        .save()
        .then(contact=>
          response.json(contact))
        .catch(error=>next(error))
      }
    })
})

app.put('/api/phonebook/:id', (request, response)=>
{
  phonebook.findByIdAndUpdate(request.params.id, request.body, {runValidators:true ,context:"query"})
  .then(filler => 
          response
            .json(request.body))

  .catch(filler => 
          response
            .status(404)
            .json({error:"Invalid Id"}))
})

app.delete('/api/phonebook/:id', (request, response)=>
{
  const id = request.params.id
  phonebook.findByIdAndDelete(id).then(
    deletedContact=>
    {
      console.log("Contact Deleted Successfully")
      console.log(deletedContact)
      response.json(deletedContact)
    }
  )
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT||3001
app.listen(PORT)
console.log(`Server is listening on port ${PORT}`)