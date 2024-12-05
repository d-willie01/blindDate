const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../models/User')




dotenv.config();

const spendUserCoins = async(req, res) =>{
    
    const coinSubtractAmount = req.body.coinAmount
    

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    console.log("amount to subtract:", coinSubtractAmount, "user to sub from:", decodedToken);

    if(decodedToken)
    {
        try {
            const user = await User.findOne({email: decodedToken.email})

            if(user)
            {

                if(user.tokenCount < coinSubtractAmount)
                {
                    return res.status(400).json({error: 'Not Enough Tokens'})
                }
                console.log("this is the user:", user)

                user.tokenCount -= coinSubtractAmount;
                user.transactions.push({
                    type:'spend',
                    amount: coinSubtractAmount,
                    description: 'Spent Tokens',
                    date: Date.now()
                })
                await user.save();
            }
        } catch (error) {
            res.status(500).json({error: 'Server Error'})
        }
    }

    res.json({
        ass: "eaterrrrrrrrrrrrrrrrrrrr"
    })



}

module.exports = {spendUserCoins};