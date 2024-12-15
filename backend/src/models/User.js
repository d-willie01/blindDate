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
  premiumStatus: {
    isActive: {
      type: Boolean,
      default: false,
    },
    activatedAt: {
      type: Date,
      required: false,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
  },
  potentialConnections: [
    {
      email: {
        type: String,
        required: true,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
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

// Add a method to activate the premium status for 24 hours
userSchema.methods.activatePremium = function () {
  const now = Date.now();
  
  // Check if the previous premium status has expired
  if (this.premiumStatus.expiresAt && now > this.premiumStatus.expiresAt) {
    this.premiumStatus.isActive = false; // Deactivate if expired
  }

  // Activate the premium status for 2 minutes (for testing)
  this.premiumStatus.isActive = true;
  this.premiumStatus.activatedAt = now;

  
  this.premiumStatus.expiresAt = new Date(now + 2 * 60 * 1000); // 2 minutes from now

  //Real 24 hour time
  //this.premiumStatus.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  return this.save();
};


// Create a User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;



// const mongoose = require('mongoose');
// const transactionSchema = require('./Transactions'); // Import the Transaction schema

// // Define the User schema
// const userSchema = new mongoose.Schema({
//   googleId: {
//     type: String,
//     unique: true,
//     sparse: true,
//   },
//   twitterId: {
//     type: String,
//     unique: true,
//     sparse: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   name: {
//     type: String,
//     required: false,
//   },
//   profilePicture: {
//     type: String,
//     default: '',
//   },
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//     required: false,
//   },
//   dateOfBirth: {
//     type: Date,
//     required: false,
//   },
//   refreshToken: {
//     type: String,
//     required: false,
//   },
//   tokenCount: {
//     type: Number,
//     default: 0, // Default to 0 tokens for new users
//     min: 0, // Ensure token count cannot go below 0
//   },
//   transactions: [transactionSchema], // Use the imported Transaction schema
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Middleware to update the `updatedAt` field before saving
// userSchema.pre('save', function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Create a User model using the schema
// const User = mongoose.model('User', userSchema);

// module.exports = User;


