const express = require('express');
const userRouter = express.Router();
const {updateUser} = require('./updateUser')
const {getSelf} = require('./getSelf')



userRouter.post("/registration", updateUser);
userRouter.get("/self", getSelf);

module.exports = userRouter