const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    actors: [{ type: String, required: true }],
    releaseDate: {
        type: String,
        required: true,
    },
    posterUrl: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
    },
    bookings: [{
        type: mongoose.Types.ObjectId,
        ref : "Booking"

    }],
    admin: {
        type: mongoose.Types.ObjectId,
        ref:"admin",
        required: true,
    },
});

module.exports = mongoose.model('Movie', movieSchema);
