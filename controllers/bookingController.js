const mongoose = require('mongoose');
const Bookings = require('../models/bookingModel');
const Movie = require('../models/movieModel');
const User = require('../models/userModel');


const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  let existingMovie;
  let existingUser;

  try {
    // Find the existing movie and user
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    console.log(err);
  }

  // Check if movie and user exist
  if (!existingMovie) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    // Create a new booking instance
    const booking = new Bookings({
      movie,
      date: new Date(date),
      seatNumber,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    // Push booking to user and movie arrays
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);

    // Save changes to the database
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });

    // Commit the transaction
    session.commitTransaction();

    // Return success response
    res.status(201).json({ message: 'Booking successful', booking: booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getAllBookings = async (req, res, next) => {
  try {
    const allBookings = await Bookings.find();
    res.status(200).json({ bookingsArr: allBookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// const getAllBookings = async (req, res, next) => {
//   try {
//     const allBookings = await Bookings.find().populate('User Movie'); // Assuming you have defined 'userObj' and 'movieObj' as references in your Bookings schema
//     res.status(200).json({ bookingsArr: allBookings });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };









const deleteBooking = async (req, res, next) => {
    const bookingId = req.params.id;
  
    try {
      const deletedBooking = await Bookings.findByIdAndDelete(bookingId).populate("user movie");
  
      if (!deletedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      const session = await mongoose.startSession();
      session.startTransaction();
  
      // Remove booking from user and movie arrays
      await User.findByIdAndUpdate(deletedBooking.user, { $pull: { bookings: bookingId } }, { session });
      await Movie.findByIdAndUpdate(deletedBooking.movie, { $pull: { bookings: bookingId } }, { session });
  
      // Commit the transaction
      await session.commitTransaction();
  
      res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  


const getBooking = async (req, res, next) => {
    const bookingId = req.params.id;

    try {
        const booking = await Bookings.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'You got the booking successfully', booking: booking });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = {
  newBooking,
  getAllBookings,
  deleteBooking,
  getBooking,
  
};
