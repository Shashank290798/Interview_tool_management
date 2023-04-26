const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId
let resultModel = new mongoose.Schema({
    candidate_id:{
        type:ObjectId,
        ref:'candidates',
        rquired:true
    },
    submited_by:{
        type:ObjectId,
        ref:'users',
        rquired:true
    },
    category_details:[
        {
            category_name:{
                type:String,
                required:true
            },
            points_acquired:{
                type:Number,
                required:true
            }
        }
    ],
    created_at:{
        type:Date,
        required:true
    },
    updated_at:{
        type:Date,
        default:null
    },
    updated_by:{
        type:ObjectId,
        ref:'users',
        default:null
    },
    result_status:{
        type:String,
        enum:['pending','rejected','selected'],
        default:'pending'
    },
    pass_criteria:{
        type:Number,
        rquired: true
    },
    system_status:{
        type:String,
        enum:['selected','rejected']
    },
    total_points:{
        type:Number,
        required: true
    }
})

module.exports = mongoose.model('results', resultModel)