const express = require('express');
const User = require('../../models/User');
const Feedback = require('../../models/Feedback'); // Import the Feedback model

const getData = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Count male and female users
    const maleCount = users.filter((user) => user.gender === 'male').length;
    const femaleCount = users.filter((user) => user.gender === 'female').length;

    // Collect all transactions from all users
    const allTransactions = users.flatMap((user) => user.transactions);

    // Fetch all feedback entries
    const allFeedback = await Feedback.find();

    // Send the response to the client with counts, transactions, and feedback
    res.json({
      maleCount,
      femaleCount,
      allTransactions,
      allFeedback, // Include feedback in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the data.' });
  }
};

module.exports = { getData };
