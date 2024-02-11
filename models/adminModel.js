const mongoose = require('mongoose')
const Schema = mongoose.Schema
const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        // minLength:6,
    },
    addedMovies:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Movie"
        }
    ]
    

})
module.exports = mongoose.model('admin',adminSchema)
