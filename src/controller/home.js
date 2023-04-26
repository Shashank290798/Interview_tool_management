// let userModel = require('../../models/userModel');
// let candidateModel = require('../../models/addCandidate');

exports.dashboard = async (req, res) => {
  try {
     
    res.render("pages/home", );
  } catch (error) {
    let role = req.role;
    console.log(error)
  }
};
