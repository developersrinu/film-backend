
const express = require('express')
const movieRouter = express.Router()
const {addMovie,getAllMovies,getMovieById} = require('../controllers/movieContoller')

movieRouter.post('/add',addMovie)
movieRouter.get('/allmoives',getAllMovies)
movieRouter.get('/:id',getMovieById)










module.exports = movieRouter