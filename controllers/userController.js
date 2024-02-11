const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Movie = require('../models/movieModel')
const Bookings = require('../models/bookingModel')
const mongoose = require('mongoose')

// Fetch all users ==========================================================================================
const getAllUsers = async (req, res, next) => {
    let users;
    try {
        // Retrieve all users from the database
        users = await User.find();
    } catch (error) {
        // Handle errors during user retrieval
        console.error('Error while fetching users:', error);
        return next(error);
    }

    if (!users) {
        // Handle case where users are not found
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }

    // Return the list of users in the response
    return res.status(200).json({ users });
};

// Signup a new user ========================================================================================
// const signup = async (req, res, next) => {
//     const { username, email, password } = req.body;

//     if (!username || username.trim() === '' || !email || email.trim() === '' || !password || password.trim() === '') {
//         // Validate input fields
//         return res.status(400).json({ message: 'Invalid inputs' });
//     }

//     try {
//         // Hash the user's password before saving it to the database
//         const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt rounds
//         const user = new User({
//             username,
//             email,
//             password: hashedPassword,
//         });

//         // Save the user to the database
//         await user.save();

//         // Return the newly created user in the response
//         return res.status(201).json({ user });
//     } catch (error) {
//         // Handle errors during signup
//         console.error('Error during signup:', error);
//         next(error);
//     }
// };
const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        if (!username || username.trim() === '' || !email || email.trim() === '' || !password || password.trim() === '') {
            // Validate input fields
            return res.status(400).json({ message: 'Invalid inputs' });
        }

        // Hash the user's password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt rounds
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await user.save();

        // Return the newly created user in the response
        return res.status(201).json({ message: 'User registration successfully', user: user._id });

    } catch (error) {
        // Handle errors during signup
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ message: 'Email is already in use' });
        } else {
            console.error('Error during signup:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = { signup };


// Signin an existing user ===================================================================================
const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || email.trim() === '' || !password || password.trim() === '') {
        // Validate input fields
        return res.status(422).json({ message: 'Invalid inputs' });
    }

    try {
        // Use findOne to check if the user with the provided email exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            // Handle case where user is not found
            return res.status(401).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (isPasswordValid) {
            // Return success message for valid login
            return res.status(200).json({ message: 'Login successful', user: existingUser._id });
        } else {
            // Handle case where provided password is invalid
            return res.status(401).json({ message: 'Invalid password' });
        }
    } catch (error) {
        // Handle errors during signin
        console.error('Error during signin:', error);
        next(error);
    }
};
//updateUser =================================================================================================
const getUser = async (req, res, next) => {
    const userId = req.params.id; // Assuming the user ID is passed as a route parameter
    try {
        // Check if the provided user ID is valid
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
   
        const user = await User.findById(userId);

        // Check if the user with the given ID exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user in the response
        return res.status(200).json({ user });
    } catch (error) {
        // Handle errors during the process
        console.error('Error fetching user:', error);
        next(error);
    }
};

//deleteUser =================================================================================================
const deleteUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
        // Check if the provided user ID is valid
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Use findByIdAndDelete to find the user by ID and delete them
        const user = await User.findByIdAndDelete(userId);

        // Check if the user with the given ID exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return a success message in the response
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        // Handle errors during the delete process
        console.error('Error deleting user:', error);
        next(error);
    }
};


// const getBookingsofUser = async (req, res, next) => {

//     const id = req.params.id
//     let bookings;
//     try {

//         bookings = await Bookings.find({ user: id })



//     } catch (err) { console.log(err) }

//     if (!bookings) {
//         return res.status(500).json({ message: 'bookings not found' })
//     }
//     return res.status(200).json({ bookings })

// }





// Your existing code


const getBookingsofUser = async (req, res, next) => {
    const id = req.params.id;
    let bookings;
    try {
        // Populate the 'user' field with complete user objects
        bookings = await Bookings.find({ user: id }).populate('movie')
     
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (!bookings) {
        return res.status(404).json({ message: 'Bookings not found' });
    }
    return res.status(200).json({ bookings });
};






















module.exports = { getAllUsers, signup, signin, getUser, deleteUser, getBookingsofUser };




