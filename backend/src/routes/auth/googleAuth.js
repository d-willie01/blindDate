const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../../models/User'); // Adjust this path based on your structure
const dotenv = require('dotenv');

dotenv.config();

const getGoogleAuth = async(req, res) => {


    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);

    
    // Function to verify Google ID token
    async function verifyGoogleToken(idToken) {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    }
    
    // Function to create or find the user in MongoDB
    async function findOrCreateUser(googleUser) {
      let isNewUser = false
      const { sub: googleId, email, name } = googleUser;
      let user = await User.findOne({ googleId });
    
      if (!user) {
        user = await User.create({ googleId, email, name });
        console.log("New User Create", user);
        isNewUser = true
      }
    
      return {user, isNewUser};
    }
    
    // Function to generate a custom JWT ACCESS for your app
    function generateToken(user) {
      const payload = {
        userId: user._id,
        email: user.email,
      };
      return jwt.sign(payload, process.env.JWT_SECRET_KEY, { algorithm: "HS256", expiresIn: '1h' });
    }

    //REFRESH TOKEN
    function generateRefreshToken(user) {
      const payload = {
        userId: user._id,
        email: user.email,
      };
      return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, { algorithm: "HS256", expiresIn: "7d" });
    }
    
    
    // Route handler

      
      const { authentication: idToken } = req.body;
    
    
      try {
        // Verify Google ID token
        const googleUser = await verifyGoogleToken(idToken);

    
        // Create or find user in MongoDB
        const {user, isNewUser} = await findOrCreateUser(googleUser);
    
        // Generate a JWT for the user
        const jwtAccessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

            user.refreshToken = refreshToken;
            await user.save();
    
        // Send the JWT & Refresh token back to the frontend
        res.json({ 
          jwtAccessToken, 
          refreshToken, 
          NewUser: isNewUser 
        });
      } catch (error) {
    
        console.error("Authentication error:", error);
        
        res.status(401).json({ error: "Authentication failed" });
      }
   
}

module.exports = { getGoogleAuth };


