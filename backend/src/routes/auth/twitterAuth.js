const { OAuth } = require('oauth');
const jwt = require('jsonwebtoken');
const User = require('../../models/User'); // Adjust this path based on your structure
const dotenv = require('dotenv');

dotenv.config();

const verifyTwitterToken = async (req, res) => {
    const { token, secret } = req.body;

    // OAuth 1.0a configuration for Twitter
    const twitterOAuth = new OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        process.env.TWITTER_API_KEY,
        process.env.TWITTER_API_SECRET,
        '1.0A',
        null,
        'HMAC-SHA1'
    );

    // Function to create or find the user in MongoDB
    async function findOrCreateUser(twitterUser) {
        let isNewUser = false;
        const { id_str: twitterId, email, name } = twitterUser;
        let user = await User.findOne({ twitterId });

        if (!user) {
            user = await User.create({ twitterId, email, name });
            console.log("New User Created", user);
            isNewUser = true;
        }

        return { user, isNewUser };
    }

    // Function to generate a custom JWT ACCESS for your app
    function generateToken(user) {
        const payload = {
            userId: user._id,
            email: user.email,
        };
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { algorithm: "HS256", expiresIn: '1h' });
    }

    // Refresh token function
    function generateRefreshToken(user) {
        const payload = {
            userId: user._id,
            email: user.email,
        };
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, { algorithm: "HS256", expiresIn: "7d" });
    }

    try {
        // Use token and secret to verify and fetch user data from Twitter
        twitterOAuth.get(
            'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
            token, // Access token
            secret, // Access token secret
            async (error, data) => {
                if (error) {
                    console.error("Error verifying Twitter token:", error);
                    return res.status(401).json({ error: "Invalid Twitter token" });
                }

                const twitterUser = JSON.parse(data);
                console.log("Twitter user data:", twitterUser);

                // Create or find user in MongoDB
                const { user, isNewUser } = await findOrCreateUser(twitterUser);

                // Generate JWT and refresh tokens
                const jwtAccessToken = generateToken(user);
                const refreshToken = generateRefreshToken(user);

                // Save the refresh token to the user object
                user.refreshToken = refreshToken;
                await user.save();

                // Send the JWT and refresh token back to the frontend
                res.json({
                    jwtAccessToken,
                    refreshToken,
                    NewUser: isNewUser,
                });
            }
        );
    } catch (error) {
        console.error("Error verifying Twitter token:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { verifyTwitterToken };

