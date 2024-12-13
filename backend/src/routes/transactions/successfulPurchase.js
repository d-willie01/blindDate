const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../models/User');


dotenv.config();


const successfulPurchase = async(req, res) =>{


  

const event = req.body

res.sendStatus(200);


  
    if(event.type === 'checkout.session.completed')
    {

      console.log("inside the if:", event.data.object.metadata)

      const coinAmount = event.data.object.metadata.addCoins
      const token = event.data.object.metadata.user_jwt
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
      

        try {
            const user = await User.findOne({email: decodedToken.email})

            if(user)
            {
                    console.log("This is the user:", user, "requesting this amount:", coinAmount)

                    user.tokenCount = Number(user.tokenCount) + Number(coinAmount); 
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

; 
}

module.exports = {successfulPurchase};