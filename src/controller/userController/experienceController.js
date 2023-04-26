let experienceModel = require('../../models/experienceModel');
const constants = require('../../utils/constants');
let moment = require('moment')

let createExperience = async (req, res)=>{
    try {
        let {experience_level} = req.body
        if(!experience_level) return res.status(400).send({status:400, message:constants.error.NO_EXPERIENCE_LEVEL});

        let check_experience_level = await experienceModel.find({experience_level:experience_level});

        if(check_experience_level.length > 0) return res.status(400).send({status:400, message:constants.error.DUPLICATE_EXPERIENCE})
        
        let created_at =  moment().utc(`${new Date()}`).utcOffset("+05:30");

        let create_experince = await experienceModel.create({ experience_level:experience_level, created_at:created_at });

        res.status(201).send({status:201, data:create_experince, message:constants.success.SUCCESS});
    } catch (error) {
        res.status(501).send({status:501, data:{}, message:error.message});
    }
};

module.exports = createExperience