let categoryModel = require('../../models/categoryModel');
let XLSX = require('xlsx');
let constants = require('../../utils/constants');
let moment = require('moment');
let fs = require('fs');

let experienceModel = require('../../models/experienceModel');
let technologyModel = require('../../models/addTechnologies');
let resultModel = require('../../models/resultModel');
let candidateModel = require('../../models/addCandidate');


const createCategory = async (req, res)=>{
    try {

        //checking if file found or not 
        if(!req.file){
            return res.status(400).send({status:400, data:{}, message:constants.error.NO_FILE});
        }

        let user_id = req.user_id 
        let {experience_id, pass_criteria, technology_id } = req.body;

        //check if already a category created on this experince level then throw error
        let check_category_for_experience = await categoryModel.find({experience_id:experience_id, technology_id:technology_id });
        
        if(check_category_for_experience.length > 0){
            fs.unlink(`${__dirname}/../../../categoryXL/${req.file.filename}`,function(err){
                if(err) return console.log(err);
           })
            return res.status(400).send({status:400, data:{}, message:constants.error.DOC_EXIST})
        }

        //reading the xl and converting it into JSON obj
        let path = req.file.path;
        var workbook = XLSX.readFile(path);
        var sheet_name_list = workbook.SheetNames;
        let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        //console.log(jsonData)

        //checking if file data has been there or not 
        if (jsonData.length === 0) {

            return res.status(400).send({status:400, data:{}, message:constants.error.NO_DATA_FOUND})
          }
        
        let set = new Set();
        let category_details = [];

        for(let i=0; i<jsonData.length; i++){
            if(jsonData[i]){
                set.add(jsonData[i].category_name.toLowerCase())
            }
        }
        for(item of set){
            category_details.push({category_name:item})
        }

        let create_category = await categoryModel.create({
            technology_id:technology_id,
            experience_id: experience_id,
            category_details:category_details,
            created_by:user_id,
            created_at: moment().utc(`${new Date()}`).utcOffset("+05:30"),
            pass_criteria:pass_criteria
        })

       fs.unlink(`${__dirname}/../../../categoryXL/${req.file.filename}`,function(err){
        if(err) return console.log(err);
   });
       return res.status(201).send({status:201, data:create_category, sucess:'Created successfully'})

    } catch (error) {
        console.log(error)
        res.status(500).send({status:500, data:{}, message:error.message})
    }
}

let getJugementForm = async (req, res)=>{
    try {
        let role = req.role;

        let get_technologies = await technologyModel.find({isDeleted:false});

        let get_experience = await experienceModel.find();
   
        let get_category_data = await categoryModel.aggregate([
            {
                $lookup:{
                    from:'users',
                    localField:'created_by',
                    foreignField:'_id',
                    as:'created_by_details'
                }
            },
            {
                $lookup:{
                    from:'experiences',
                    localField:'experience_id',
                    foreignField:'_id',
                    as:'experience_details'
                }
            },
            {
                $lookup:{
                    from:'technologies',
                    localField:'technology_id',
                    foreignField:'_id',
                    as:'technology_details'
                }
            }
        ])
        

        res.render('pages/addJudgementForm',{role: role, technologies:get_technologies, experience:get_experience, category:get_category_data});
    } catch (error) {
        let role = req.role
        console.log(error);
        res.render('pages/500',{role: role})
    }
}

// let getJugementForm_submit = async ( req, res)=>{
//     try {
//         let form_id = req.query.formId;
//         console.log(form_id)

//         let get_form = await categoryModel.find({_id:form_id});

//         res.status(200).send({status:200, data:get_form, message:"Data Sent Successfully"});
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({status:500, data:{}, message:error.message})
//     }
// }

let getForm = async (req, res)=>{
    try {
        let role = req.role
        let form_id = req.query.formId;
        let candidate_id = req.query.candidateId

        let get_candidate = await candidateModel.find({_id: candidate_id});
        console.log(get_candidate)
        let get_form = await categoryModel.find({_id:form_id});
//console.log(get_form)
        res.render('pages/submitForm',{role:role, form_data:get_form, candidate:get_candidate });
    } catch (error) {
        console.log(error)
       res.render('pages/500', {role:req.role})
    }
}

let postForm = async (req, res)=>{
    try{
        let category_id = req.params.category_id;
        /**
         * req.body is dynamic and can varey the but input wil be in below format
         * we are expecting only this format from req.body
         * {
         * 'result_status':<reject or pending or selected>
            'project explation': '5',
            'technology': '8',
            'communication': '9',
            'technical skills': '9'
            } 
            changing this into the below format
            [
                {
                    category_name:'project explation',
                    points_acquired:5
                },
                {
                    category_name:'technology',
                    points_acquired:8
                },
                {
                    category_name:'communication',
                    points_acquired:9
                },
                {
                    category_name:'technical skills',
                    points_acquired:9
                }
            ]
         */
       // console.log(req.body)
        let category_details = []
        for(let item in req.body){
                if(item != 'result_status'){
            category_details.push({
                category_name:item,
                points_acquired:req.body[item]*1
            })
        }
        }
        
        let category_info = await categoryModel.find({
            _id:category_id
        })
        
        let system_response = '';
        let total = (category_details.reduce((acc, curr) => acc+curr.points_acquired, 0)/(category_details.length*10))*100
        // console.log('total ->',total)
        if(total <= category_info[0].pass_criteria){
            system_response = 'rejected'
        } else {
            system_response = 'selected'
        }

        let new_result_data = await resultModel.create({
            candidate_id:'6409c3728db0f64dbd2b54e4',
            submited_by: req.user_id,
            category_details:category_details,
            created_at:moment().utc(`${new Date()}`).utcOffset("+05:30"),
            result_status:req.body.result_status,
            pass_criteria:category_info[0].pass_criteria,
            system_status:system_response,
            total_points:total
        });
        
        return res.redirect('/getShedules')
    } catch(err){
        console.log(err)
        res.render('pages/500',{role: req.role})
    }
}

module.exports = {createCategory,getJugementForm, getForm, postForm }