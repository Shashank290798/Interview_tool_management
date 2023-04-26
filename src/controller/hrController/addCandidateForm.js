let technologyModel = require('../../models/addTechnologies');
let userModel = require('../../models/userModel');
let categoryModel = require('../../models/categoryModel');

let candiateForm = async (req, res)=>{
    try {
        let role =req.role
        if(role !== 'hr'){
            res.render('pages/401', {role:role})
        }
        let technology = await technologyModel.find({isDeleted: false});
        let interviewer = await userModel.find({user_role:'interviewer'});
        // console.log(interviewer)
        let getCategory = await categoryModel.aggregate([
            {
                $lookup:{
                    from:'technologies',
                    foreignField:'_id',
                    localField:'technology_id',
                    as:'technology_details'
                }
            },
            {
                $lookup:{
                    from:'experiences',
                    foreignField:'_id',
                    localField:'experience_id',
                    as:'experience_details'
                }
            },
            { 
                $sort: { "technology_details.technology_name": 1 } 
              },
        ])
        
        
console.log(getCategory)
        res.render('pages/addCandidate',{technology:technology, interViewer:interviewer, role:role, category:getCategory });
    } catch (error) {
        let role = req.role;
        res.render('pages/500', {role:role})
    }
}

module.exports = candiateForm