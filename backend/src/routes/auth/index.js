const express = require('express');
const authRouter = express.Router();
const {getGoogleAuth} = require('./googleAuth')
const {refreshAccessToken} = require('./refreshToken')



authRouter.post("/google", getGoogleAuth);
authRouter.post("/refreshToken", refreshAccessToken);

module.exports = authRouter