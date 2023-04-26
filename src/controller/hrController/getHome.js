let userModel = require('../../models/userModel');
let candidateModel = require('../../models/addCandidate');

exports.dashboard = async (req, res) => {
  try {
    let role = req.role;
    let name = req.userName;
   // console.log(role,name)
    let interviewerCount = await userModel.find({user_role:"interviewer", user_is_deleted: false}).count();
    let candidateCount = await candidateModel.find().count();
    let hrCount = await userModel.find({user_role:"hr", user_is_deleted: false}).count(); 
    res.render("pages/home", {role:role,name:name, interviewerCount:interviewerCount, candidateCount:candidateCount, hrCount:hrCount});
  } catch (error) {
    let role = req.role;
    console.log(error)
    logger.error(error);
    res.render('pages/500', {role:role})
  }
};
