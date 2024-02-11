const express = require('express');
const router = express.Router();
const { getAllUsers,signup,signin,getUser,deleteUser, getBookingsofUser} = require('../controllers/userController');


router.get('/', getAllUsers);
router.post('/signup',signup)
router.post('/signin',signin)
router.get('/:id',getUser)
router.delete('/:id',deleteUser)
router.get("/bookings/:id",getBookingsofUser)


module.exports = router;


