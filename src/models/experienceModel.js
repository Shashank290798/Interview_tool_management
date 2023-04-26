const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    experience_level:[
        {
            type:Number,
            required:true
        }
    ],
    created_at:{
        type:Date,
        required:true
    },
    updated_at:{
        type:Date,
        default: null
    }
});

module.exports = mongoose.model('experience', experienceSchema )