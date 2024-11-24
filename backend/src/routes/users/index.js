const express = require('express');
const userRouter = express.Router();
const {updateUser} = require('./updateUser')



userRouter.post("/registration", updateUser);

module.exports = userRouter