const express = require('express');
const transactionRouter = express.Router()
const {addUserCoins} = require('./addCoins');
const {spendUserCoins} = require('./spendCoins');
const {successfulPurchase} = require('./successfulPurchase')

transactionRouter.post('/addCoins', addUserCoins)
transactionRouter.post('/spendCoins', spendUserCoins)
transactionRouter.post('/successfullTransaction', successfulPurchase)


module.exports = transactionRouter
