const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../models/User')




dotenv.config();

const addUserCoins = async(req, res) =>{


    console.log("should contain the transaction coin amount:", req.body.transaction.amount)
    const coinAmount = req.body.transaction.amount
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

    //console.log("This is the decoded token ready to add coins:", decodedToken)

    if(decodedToken)
    {

        try {
            const user = await User.findOne({email: decodedToken.email})

            if(user)
            {
                    console.log("This is the user:", user, "requesting this amount:", coinAmount)

                    user.tokenCount += coinAmount;
                    user.transactions.push({
                        type:'purchase',
                        amount: coinAmount,
                        description: 'Purchased Tokens',
                        date: Date.now()
                    })
                    await user.save();
            }


        } catch (error) {
            console.log("error finding user:", error)
        }
        

        






    }


    res.json({
        ass: "eaterrrrrrrrrrrrrrrrrrrr"
    })


}

module.exports = {addUserCoins};