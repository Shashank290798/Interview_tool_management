const logger = require("../../utils/logger");
const User = require("../../models/userModel");

// Get request for Interviewer
let getInterviewer = async (req, res) => {
  try {
    let role = req.role
    if(role !== 'superadmin'){
     return res.render('pages/401',{role: role})
    }
    const interviewerList = await User.find({
      user_role: "interviewer",
      user_is_deleted: false,
    });
    res.render("pages/interviewer", { interviewerList: interviewerList, role: role });
  } catch (error) {
    logger.error(error);
  }
};

module.exports = getInterviewer;
