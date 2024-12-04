const mongoose = require('mongoose');

// Define the Transaction schema
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['purchase', 'spend'], // Type of transaction
    required: true,
  },
  amount: {
    type: Number, // Number of tokens involved in the transaction
    required: true,
    min: 0, // Ensure non-negative amounts
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the transaction date
  },
  description: {
    type: String, // Optional field for additional details about the transaction
    default: '',
  },
});

module.exports = transactionSchema;
