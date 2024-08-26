const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

let phonebook = {
    "phonebook": [
      {
        "id": "1",
        "name": "what",
        "number": "123"
      },
      {
        "id": "2",
        "name": "who",
        "number": "345"
      },
      {
        "id": "3",
        "name": "wehre",
        "number": "567"
      }
    ]
  }

morgan.token("phonebook", (request, response) =>
{
  return JSON.stringify(request.body)
}
)

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Endpoint Doesn't Exist" });
}

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan('Server running on port 3001'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :phonebook'))

app.get('/', (request, response)=> 
        response.send("<h1>Hello World</h1>"))

app.get('/api/phonebook', (request, response)=> 
    response.json(phonebook["phonebook"]))


app.get('/api/phonebook/:id', (request, response)=> 
{
    const note = phonebook["phonebook"].find(contact=>contact.id == request.params.id)
    if(note) response.json(note)
    else     
    {
        response.statusMessage = "Contact of that id doesn't exist"
        response.status(404).end()
    }
})


app.get('/api/info', (request, response)=>
{
    const numberOfContact = phonebook["phonebook"].length
    const date = new Date().toString()
    const DisplayNumber = `<p>Phonebook has info for ${numberOfContact} people</p>`
    response.send(DisplayNumber+date)
})


app.post('/api/phonebook', (request, response)=> 
{
    const new_contact = request.body
    if(!phonebook["phonebook"].some(contact=>contact.name == new_contact.name))
    {
      console.log(!phonebook["phonebook"].some(contact=>contact.name == new_contact.name))
      console.log(new_contact)
      const id = Math.max(...phonebook["phonebook"].map(contact=>Number(contact.id)))
      new_contact.id = String(id+1)
      phonebook = [...phonebook["phonebook"], new_contact]
      response.json(phonebook)
    }
    else
    {
      response.json("error:name must be unique")
    }
})

app.delete('/api/phonebook/:id', (request, response)=>
{
    const id = request.params.id
    phonebook["phonebook"] = phonebook["phonebook"].filter(contact=>contact.id != id)
    response.status(204).end()
})


app.use(unknownEndpoint)

const PORT = process.env.PORT||3001
app.listen(PORT)
console.log(`Server is listening on port ${PORT}`)