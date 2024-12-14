const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Feedback = require('../../models/Feedback');


dotenv.config();


const takeFeedback = async(req, res) =>{

console.log(req.body);
const {userEmail, feedbacktext, emotion, followupState, type, reportText} = req.body


switch(req.body.type) {
    case 'feedback':

        

            console.log(userEmail, feedbacktext, emotion, followupState)

        const newFeedBack = new Feedback({

                userEmail: userEmail,
                type: type,
                message: feedbacktext,
                followup: followupState,
                emotion: emotion

        })

        try {
            await newFeedBack.save();
            res.json({ message: 'Feedback saved successfully!' });
        } catch (error) {
            console.error('Error saving feedback:', error);
            res.status(500).json({ error: 'Error saving feedback' });
        }

        break;
        
    case 'report':

    

                    const newFeedBackReport = new Feedback({

                        userEmail: userEmail,
                        type: type,
                        message: reportText,
                        followup: followupState,
                        

                })

                try {
                    await newFeedBackReport.save();
                    res.json({ message: 'Feedback saved successfully!' });
                } catch (error) {
                    console.error('Error saving feedback:', error);
                    res.status(500).json({ error: 'Error saving feedback' });
                }
        
    






        break;
}



}


module.exports = {takeFeedback}