const express = require('express');
const authRouter = express.Router();
const {getGoogleAuth} = require('./googleAuth')
const {verifyTwitterToken} = require('./twitterAuth')
const {refreshAccessToken} = require('./refreshToken')



authRouter.post("/google", getGoogleAuth);
authRouter.post('/twitter', verifyTwitterToken)
authRouter.post("/refreshToken", refreshAccessToken);

module.exports = authRouter