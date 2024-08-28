const mongoose = require("mongoose")
const password = process.argv[2]

const url =`mongodb+srv://jojonobizarreadventure:${password}@cluster0.nprzq.mongodb.net/PhoneBookApp?retryWrites=true&w=majority&appName=PhoneBookApp`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
        "name": String,
        "number": String}
)

let phonebook = new mongoose.model('phonebook', phonebookSchema)

const contact = new phonebook(
  {
    "name": "prabin",
    "number": "9876"
  }
)

if(process.argv[3]==undefined && process.argv[4]==undefined)
{    
phonebook.find({}).then(contacts=>
{
    contacts.forEach(contact=>console.log(contact))
    mongoose.connection.close()
})
}
else
{
    const new_contact = new phonebook(
        {
            "name": process.argv[3],
            "number": process.argv[4]
        }
    )

    new_contact.save().then(result=>
    {
        console.log("Contact Saved")
        mongoose.connection.close()
    }
    )
}