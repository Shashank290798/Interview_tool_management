const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const categoryModel = new mongoose.Schema({
    technology_id:{
        type:ObjectId,
        ref:'technologies'
    },
    experience_id:{
        type:ObjectId,
        ref:'experiences'
    },
    category_details:[
        {
            category_name:{
                type:String,
                required: true,
                trim:true
            },
            is_Active:{
                type:Boolean,
                default:true
            }
        }
    ],
    created_by:{
        type:ObjectId,
        ref:'users'
    },
    update_by:{
        type:ObjectId,
        ref:'users',
        default:null
    },
    created_at:{
        type:Date,
        required:true
    },
    updated_at:{
        type:Date,
        default:null
    },
    pass_criteria:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('category', categoryModel)