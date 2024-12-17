const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const dotenv = require('dotenv');

dotenv.config();

const refreshAccessToken = async(req, res) =>{

   
    const refreshToken = req.body.refreshToken

    if (!refreshToken)
    {
        return res.status(401).json({
            error: "Refresh Token Missing"
        })
    }

    try {
        
        const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY)

        const user = User.findById(decodedToken.userId)

        if(!user)
        {
            return res.status(403).json({
                error: "Invalid refresh token. Please Login"
            })

        }

        const accessToken = jwt.sign(

            {userId: user._id, email: user.email},

            process.env.JWT_SECRET_KEY,

            {algorithm: "HS256", expiresIn: "1hr"}

        );
        res.json({token: accessToken})

    } catch (error) {
        //console.log("error veryfying refresh token")
        res.status(403).json({
            error: "Invalid Refresh Token"
        }) 
    }

}

module.exports = {refreshAccessToken}