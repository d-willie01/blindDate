const mongoose = require('mongoose');


const feedBackSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['feedback', 'report'],
        required: true
    },
    message:
    {
        type: String,
        required: true,
        minLength: 5
    },
    followup: {
        type: String,
        enum: ['Yes', 'No'],
        required: true,
    },
    emoji: {
        type: Number,
        required: false
    },
    
},
{ timestamps: true })

const Feedback = mongoose.model('Feedback', feedBackSchema);

module.exports = Feedback;