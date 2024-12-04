const express = require('express');
const transactionRouter = express.Router()
const {addUserCoins} = require('./addCoins');
const {spendUserCoins} = require('./spendCoins');

transactionRouter.post('/addCoins', addUserCoins)
transactionRouter.post('/spendCoins', spendUserCoins)


module.exports = transactionRouter
