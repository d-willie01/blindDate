const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../models/User');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);


dotenv.config();


const successfulPurchase = async(req, res) =>{


  

const event = req.body

console.log(req.body);

res.sendStatus(200);


  
    if(event.type === 'checkout.session.completed')
    {

      console.log("inside the if:", event.data.object)

      const coinAmount = event.data.object.metadata.addCoins
      const token = event.data.object.metadata.user_jwt
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
      const paymentIntentId = event.data.object.payment_intent;
      

        try {
            const user = await User.findOne({email: decodedToken.email})

            if(user)
            {
                    
                    console.log("This is the user:", user, "requesting this amount:", coinAmount)
                    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                    console.log("This is the payment INTENT:", paymentIntent)
                    const receiptUrl = paymentIntent.charges.data[0]?.receipt_url;


                    user.tokenCount = Number(user.tokenCount) + Number(coinAmount); 
                    user.transactions.push({
                        type:'purchase',
                        amount: coinAmount,
                        description: 'Purchased Tokens',
                        date: Date.now(),
                        receiptUrl: receiptUrl || 'Receipt URL not available',
                    })
                    await user.save();
            }


        } catch (error) {
            console.log("error finding user:", error)
        }

    }

; 
}

module.exports = {successfulPurchase};