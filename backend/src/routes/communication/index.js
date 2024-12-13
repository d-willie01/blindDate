const express = require('express');
const communicationRouter = express.Router()
const {takeFeedback} = require('./feedback');


communicationRouter.post('/feedback', takeFeedback)



module.exports = communicationRouter;