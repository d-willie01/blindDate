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
    required: false,
  },
  profilePicture: {
    type: String,
    default: '', // Optional field for the user's profile picture URL
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'], // Restrict values to predefined options
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false, // Optional field for the user's date of birth
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

// Middleware to update the `updatedAt` field before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create a User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
