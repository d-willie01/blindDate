const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../models/User');


dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const URL = process.env.DOMAIN_URL






const addUserCoins = async(req, res) =>{


    console.log("should contain the transaction coin amount:", req.body.transaction.amount)
    const coinAmount = req.body.transaction.amount
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

    console.log("searching for price string:",req.body.transaction.stripePriceString)

    const priceString = req.body.transaction.stripePriceString

    

    // if(decodedToken)
    // {

    //     try {
    //         const user = await User.findOne({email: decodedToken.email})

    //         if(user)
    //         {
    //                 console.log("This is the user:", user, "requesting this amount:", coinAmount)

    //                 user.tokenCount += coinAmount;
    //                 user.transactions.push({
    //                     type:'purchase',
    //                     amount: coinAmount,
    //                     description: 'Purchased Tokens',
    //                     date: Date.now()
    //                 })
    //                 await user.save();
    //         }


    //     } catch (error) {
    //         console.log("error finding user:", error)
    //     }

    // }

    console.log("This is the token before its sent:", token)
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            //get this directly from stripe app
            //price code is sent from frontend
            price: priceString,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${URL}/home/coins/${priceString}?success=true`,
        cancel_url: `${URL}/home/coins?canceled=true`,
        automatic_tax: {enabled: true},
        metadata: {
          user_jwt: token, // Add the user's JWT to metadata
          addCoins: coinAmount
        },
    });
    
        res.status(200).json({ url: session.url });  



}

module.exports = {addUserCoins};