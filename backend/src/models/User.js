const mongoose = require('mongoose');
const transactionSchema = require('./Transactions'); // Import the Transaction schema

// Define the User schema
const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  twitterId: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  refreshToken: {
    type: String,
    required: false,
  },
  tokenCount: {
    type: Number,
    default: 0, // Default to 0 tokens for new users
    min: 0, // Ensure token count cannot go below 0
  },
  transactions: [transactionSchema], // Use the imported Transaction schema
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
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


