const mongoose = require('mongoose')
const url = 'mongodb+srv://sahilgraut:SahiL2003@namastenode.2ktfo.mongodb.net/devTinder'
const connectDb = async () => {
    await mongoose.connect(url)
}



module.exports = connectDb

