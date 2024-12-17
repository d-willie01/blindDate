const jwt = require('jsonwebtoken')
const User = require('../../models/User')

const getSelf = async(req, res) => {
    
   try {


    const token = req.headers.authorization.split(' ')[1];
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    

    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //console.log("This is status of user, Premium or not Premium",user.premiumStatus.isActive);



    premiumStatus = user.premiumStatus.isActive

    //console.log("varibale check:",premiumStatus)
    premiumStatus = user.premiumStatus.isActive;

//console.log("variable check:", premiumStatus);

res.status(200).json({
  user,          // Include the full user object
  premiumStatus  // Include the premium status separately
});



   } catch (error) {

    console.error("Error Here:", error)
    res.status(500).json({error: "Error Has Ocurred"})
   }

  };
  
  module.exports = { getSelf };