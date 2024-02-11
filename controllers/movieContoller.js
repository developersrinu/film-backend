const mongoose = require('mongoose');
const { JsonWebTokenError } = require('jsonwebtoken');
const Movie = require('../models/movieModel');
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();





const addMovie = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(422).json({ message: 'Token not found' });
    }

    let adminId;

    // Verify token
    const decrypted = await jwt.verify(token, process.env.KEY);

    if (decrypted.error) {
      return res.status(400).json({ message: decrypted.error.message });
    } else {
      adminId = decrypted.id;
      console.log(adminId);
    }

    const { title, desc, actors, releaseDate, posterUrl, featured } = req.body;

    if (
      !title ||
      title.trim() === '' ||
      !desc ||
      desc.trim() === '' ||
      !actors ||
      !releaseDate ||
      releaseDate.trim() === '' ||
      !posterUrl ||
      posterUrl.trim() === ''
    ) {
      // Validate input fields
      return res.status(422).json({ message: 'Invalid inputs' });
    }

    // Create a new movie instance
    const newMovie = new Movie({
      title,
      desc,
      actors,
      releaseDate: new Date(`${releaseDate}`),
      posterUrl,
      featured,
      admin: adminId,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    
    await newMovie.save({ session });
    
    const adminUser = await Admin.findById(adminId);
    adminUser.addedMovies.push(newMovie);
    
    await adminUser.save({ session });
    await session.commitTransaction();

    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  } catch (error) {
    // Handle errors during movie creation
    console.error('Error during movie creation:', error);
    next(error);
  }
};



const adminAddMovies = async (req, res, next) => {
  try {
    const adminId = req.params.adminId;
    const movies = await Movie.find({ admin: adminId });

    if (!movies) {
      return res.status(404).json({ message: 'Movies not found' });
    } else {
      return res.status(200).json({ movies });
    }
  } catch (error) {
    // Handle errors during movie fetching
    console.error('Error during movie fetching:', error);
    next(error);
  }
};

const getAllMovies = async (req, res, next) => {
    try {
        // Retrieve all movies from the database
        const movies = await Movie.find();

        // Return the list of movies in the response
        return res.status(200).json(movies);
    } catch (error) {
        // Handle errors during movie retrieval
        console.error('Error while fetching movies:', error);
        return res.status(500).json({ message: 'Error while fetching movies', error: error.message });
    }
};

const getMovieById = async (req, res, next) => {
  try {
      // Retrieve the movie ID from the request parameters
      const movieId = req.params.id;

      // Retrieve the movie from the database using the movie ID
      const movie = await Movie.findById(movieId);

      // If the movie is not found, return a 404 error
      if (!movie) {
          return res.status(404).json({ message: 'Movie not found' });
      }

      // Return the movie in the response
      return res.status(200).json(movie);
  } catch (error) {
      // Handle errors during movie retrieval
      console.error('Error while fetching movie:', error);
      return res.status(500).json({ message: 'Error while fetching movie', error: error.message });
  }
};





module.exports = { addMovie, getAllMovies,getMovieById};

