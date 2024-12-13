const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Feedback = require('../../models/Feedback');


dotenv.config();


const takeFeedback = async(req, res) =>{

console.log(req.body);


switch(req.body.type) {
    case 'feedback':

        const {userEmail, feedbacktext, emotion, followupState} = req.body

            console.log(userEmail, feedbacktext, emotion, followupState)

        const newFeedBack = new Feedback({

        })





        break;
    case 'report':
        
        console.log("Inside Report")






        break;
}


res.json({
    cool: "we cool"
});
}


module.exports = {takeFeedback}