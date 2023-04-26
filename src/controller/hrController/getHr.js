const logger = require("../../utils/logger");
const User = require("../../models/userModel");
const Candidate = require("../../models/addCandidate");
// Get request for Hr
exports.getHrDetails = async (req, res) => {
  try {
    let role = req.role
    if(role !== 'superadmin'){
      return res.render('pages/401',{role: role})
     }
    
    const hrList = await User.find({ user_role: "hr", user_is_deleted: false });
    //console.log({ hrList: hrList });
    res.render("pages/hr", { hrList: hrList, role: role });
  } catch (error) {
    logger.error(error);
  }
};

exports.editHr = async (req, res) => {
  try {
    let role = req.role
    if(role !== 'superadmin'){
      return res.render('pages/401',{role: role})
    }
    const id = req.params.id;
    const hr = await User.findById(id);

    if (!hr) {
      return res.status(404).json({ message: "HR not found"});
    }

    res.render("pages/editHr", { hr: hr, role:role  });
  } catch (err) {
    let role = req.role
    res.render('pages/500',{role:role})
  }
};

exports.listHrDetails = async (req, res) => {
  try {
    let role = req.role;
    const hrList = await User.find({ user_role: "hr", user_is_deleted: false });
    res.render("pages/listhr", { hrList: hrList,role:role });
  } catch (err) {
    console.log(err);
  }
};

exports.listCandidate = async (req, res) => {
  try {
    let role = req.role
    const candidate = await Candidate.find();
    res.render("pages/listcandidate", { candidate: candidate, role:role });
  } catch (err) {
    console.log(err);
  }
};
