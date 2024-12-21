const mongoose = require('mongoose');

// Make sure the environment variable is loaded
require('dotenv').config();

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdbname'; // Default to local MongoDB

const connectToDB = async () => {
  try {
    console.log('Connecting to MongoDB with URI:', dbURI);
    await mongoose.connect('mongodb://localhost:27017/X-Drive',);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

module.exports = connectToDB;
