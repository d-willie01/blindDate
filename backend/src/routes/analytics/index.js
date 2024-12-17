const express = require('express');
const analyticsRouter = express.Router();
const {getData} = require('./getData')



analyticsRouter.get("/getData", getData);


module.exports = analyticsRouter