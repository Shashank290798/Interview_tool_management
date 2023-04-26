let scheduleModel = require('../../models/SchedulerModel');
let moment = require('moment');
let mongoose = require('mongoose');
let message = require('../../utils/constants')

let cancleSchedule = async (req, res)=>{
    try {
        let message = req.body.cancle_message;
        let role = req.role;
        let user_id = req.user_id;
        let candidate_id = req.params.candidateId;
        let schedule_data = await scheduleModel.findOneAndUpdate({interview_candidate_id:candidate_id},{
            cancled_by:user_id,
            cancel_message:message,
            interview_status:"CANCELED",
            updated_at:moment().utc(`${new Date()}`).utcOffset("+05:30")
        },{new: true});
     
        return res.send({data:schedule_data})
    } catch (error) {
        console.log(error)
       // res.render('pages/500', {role: req.role})
    }
};

let getDetialsOfCancellation = async (req, res)=>{
    try {
        let Id = req.params.id;
        let cancilation_details = await scheduleModel.aggregate([
            {
                $match:{_id:mongoose.Types.ObjectId(Id)}
            },
            {
                $lookup:{
                    from:'users',
                    localField:'canceled_by',
                    foreignField:'_id',
                    as:'canceled_by_details'
                }
            }
        ]);
        if(cancilation_details.length < 1){
            return res.status(404).send({status:404, data:{}, message:'No Data Found'})
        }
        res.status(201).send(
            {
                status:201, 
                data:{
                    name:`${cancilation_details[0].canceled_by_details[0].user_first_name} ${cancilation_details[0].canceled_by_details[0].user_last_name}`,
                    cancel_message:cancilation_details[0].cancel_message
                }, 
                message:'Data Fetched Successfully'
            })
    } catch (error) {
        console.log(error)
        return res.status(500).send({status:500, message:error.message})
    }
}

module.exports = {cancleSchedule, getDetialsOfCancellation}