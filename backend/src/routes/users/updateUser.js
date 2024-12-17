const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const updateUser = async(req, res) =>{

    //console.log("Headers for the UPDATE REQUEST:", req.headers);

const {name, gender, dateOfBirth} = req.body

try {


    if (!name || !gender || !dateOfBirth) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const token = req.headers.authorization.split(' ')[1];

    

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

    //console.log("this is the user token:",decodedToken);
    

    const updatedUser = await User.findOneAndUpdate(
        {email: decodedToken.email},
        { $set: {name,gender,dateOfBirth}},
        {new: true}
    )

    if(!updatedUser)
    {
        return res.status(404).json({error: "User not found"})
    }

    res.json({message: "User updated successfully"})
    
} catch (error) {
    
    console.error("Error Here:", error)
    res.status(500).json({error: "Error Has Ocurred"})

}


}

module.exports = {updateUser}