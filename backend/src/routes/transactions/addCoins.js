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

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
    
            //get this directly from stripe app
            price: "price_1QTgm3Dfy3ekqWSiaTk5Id04",
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${URL}?success=true`,
        cancel_url: `${URL}?canceled=true`,
        automatic_tax: {enabled: true},
    });
    
        res.status(200).json({ url: session.url });  



}

module.exports = {addUserCoins};