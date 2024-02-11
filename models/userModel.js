const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength:6,
    },
    bookings:[{
        type:mongoose.Types.ObjectId, ref:'Booking'
    }]


});

// Corrected the export statement
module.exports = mongoose.model('User', userSchema);
