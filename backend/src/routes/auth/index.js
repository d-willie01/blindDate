const express = require('express');
const authRouter = express.Router();
const {getGoogleAuth} = require('./googleAuth')



authRouter.post("/google", getGoogleAuth);

module.exports = authRouter