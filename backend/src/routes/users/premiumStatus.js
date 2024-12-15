const jwt = require('jsonwebtoken')
const User = require('../../models/User')

const setPremiumStatus = async(req, res) => {

    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log(decodedToken);

    const user = await User.findOne({ email: decodedToken.email });
    try {
        
        if (!user) {
          return res.status(404).send('User not found');
        }
    
        await user.activatePremium();
        res.status(200).send('Premium status activated for 24 hours');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error activating premium status');
      }

}

module.exports = {setPremiumStatus}