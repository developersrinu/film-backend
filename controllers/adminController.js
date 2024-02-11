

const bcrypt = require('bcrypt');
const admin = require('../models/adminModel');
const Movie = require('../models/movieModel')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require('dotenv').config()


const addAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || email.trim() === '' || !password || password.trim() === '') {
        // Validate input fields
        return res.status(422).json({ message: 'Invalid inputs' });
    }

    try {
        // Check if an admin with the same email already exists
        const existingAdmin = await admin.findOne({ email });

        if (existingAdmin) {
            return res.status(409).json({ message: 'Admin with this email already exists' });
        }

        // Hash the user's password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt rounds
        const newAdmin = new admin({
            email,
            password: hashedPassword,
        });

        // Save the new admin to the database
        await newAdmin.save();

        // Return the newly created admin in the response
        return res.status(201).json({ message:"admin registration successfull",admin: newAdmin });
    } catch (error) {
        // Handle errors during signup
        console.error('Error during signup:', error);
        next(error);
    }
};




const signinAdmin = async (req, res, next) => {
    const { email, password } = req.body;

  if (!email || email.trim() === '' || !password || password.trim() === '') {
        // Validate input fields
        return res.status(422).json({ message: 'Invalid inputs' });
    }
    try {
        // Check if an admin with the provided email exists
        const existingAdmin = await admin.findOne({ email });

        if (!existingAdmin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, existingAdmin.password);

        if (isPasswordValid) {
            // Generate a JWT with a 2-day expiration
            const token = jwt.sign({ id: existingAdmin._id }, process.env.KEY, { expiresIn: '2d' });

            return res.status(200).json({
                message: 'Admin login successful',
                token: token,
                id: existingAdmin._id,
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        // Handle errors during signin
        console.error('Error during admin signin:', error);
        next(error);
    }
};


// adminController.js

const getAllAdmins = async (req, res, next) => {
    try {
      const allAdmins = await admin.find();
      return res.status(200).json({ admins: allAdmins });
    } catch (error) {
      console.error('Error while fetching all admins:', error);
      next(error);
    }
};










const getAdminById = async (req, res, next) => {
    const adminId = req.params.id; // Assuming the admin ID is passed as a route parameter
  
    try {
      // Check if the provided admin ID is valid
      if (!mongoose.isValidObjectId(adminId)) {
        return res.status(400).json({ message: 'Invalid admin ID' });
      }
  
      // Find the admin by ID
      const adminData = await admin.findById(adminId).populate('addedMovies');
  
      // Check if the admin with the given ID exists
      if (!adminData) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Return the admin in the response
      return res.status(200).json({ admin: adminData });
    } catch (error) {
      // Handle errors during the retrieval process
      console.error('Error retrieving admin:', error);
      return res.status(500).json({ message: 'Error retrieving admin', error: error.message });
    }
  };


  
  module.exports = { addAdmin, signinAdmin, getAllAdmins,getAdminById };
  






