const express = require('express')
const bookingsRouter = express.Router()
const {newBooking,getAllBookings,deleteBooking,getBooking} = require('../controllers/bookingController')



bookingsRouter.post('/', newBooking)
bookingsRouter.get('/allbookings/:id',getAllBookings)
bookingsRouter.delete('/:id',deleteBooking)
bookingsRouter.get('/:id',getBooking)




module.exports = bookingsRouter


