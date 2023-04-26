let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId
let schedulerSchema = new mongoose.Schema({
    interview_candidate_id:{
        type:ObjectId,
        ref:'candidates',
        required:true
    },
    interview_scheduler_id:{
        type:ObjectId,
        ref:'users',
        required:true
    },
    interview_interviewer_id:[{
        type:ObjectId,
        ref:"users",
        required:true
    }],
    interview_start_date_time:{
        type:String,
        required:true
    },
    interview_end_date_time:{
        type:String,
        required: true
    },
    interview_icsFile_fleName:{
        type:String,
        required: true
    },
    interview_notes: {
        type: String,
        maxlength: 250
    },
    interview_status:{
        type:String,
        required:true,
        default:"SCHEDULED",
        enum:["SCHEDULED", "DECLINED", "COMPLETED", "CANCELED" ]
    },
    interview_technology:[
        {
            type:String,
            required: true
        }
    ],
    interview_meetLink:{
        type:String
    },
    interview_notes: {
        type: String,
        maxlength: 250
      },
    crated_at:{
        type:Date,
        default: new Date()
    },
    updated_at:{
        type:Date,
        default: new Date()
    },
    canceled_by:{
        type:ObjectId,
        ref:'users',
        default:null
    },
    cancel_message:{
        type:String,
        default:null,
        trim:true
    }

});

module.exports = mongoose.model('schedules', schedulerSchema)