const mongoose = require("mongoose")


console.log("Connecting to database")
mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGO_URI)
    .then(result =>
        {console.log("Connected Successfully")})
    .catch(error=>
        {console.log("Error Connection Failed:", error.Message)})

const phonebookSchema = new mongoose.Schema({
        "name": 
          {
           type: String,
           minLength: [5, 'Name must be atleast 5 letters'],
           required: [true, "Contact Name is Required"]
          },

        "number": 
          {
            type: String,
            validate: {
              validator: function(v) {
                return /\d{9}/.test(v)
              },
              message: props => `${props.value} is not a valid number`
            },
            
            required: [true, "Contact number is Required"]
          }
      }
)

phonebookSchema.set('toJSON', {
  transform:(document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('phonebook', phonebookSchema)