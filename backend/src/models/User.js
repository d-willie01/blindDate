const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true, // Ensure googleId is unique across users
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique across users
  },
  name: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: '', // Optional field for the user's profile picture URL
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the updated date
  },
});

// Create a User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;