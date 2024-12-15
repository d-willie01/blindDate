const express = require('express');
const userRouter = express.Router();
const {updateUser} = require('./updateUser')
const {getSelf} = require('./getSelf')
const {setPremiumStatus} = require('./premiumStatus');



userRouter.post("/registration", updateUser);
userRouter.get("/self", getSelf);
userRouter.post('/setPremium', setPremiumStatus)

module.exports = userRouter