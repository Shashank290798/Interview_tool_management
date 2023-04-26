const jwt = require("jsonwebtoken");
const configs = require("../../src/config/config");
const logger = require("../utils/logger");

// JWT verify auth middleware
const authUser = (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    //console.log(token)
    if (token) {
      let verify = jwt.verify(
        token,
        process.env.SECRET_KEY || configs.SECRET_KEY
      );
     // console.log(verify)
      if (verify) {
        req.userName = verify.name;
        req.role = verify.role;
        req.user_id = verify.user_id
        next();
      } else {
       res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  } catch (error) {
    logger.error(error);
    res.clearCookie("connect.sid");
    res.clearCookie('jwt')
    res.redirect('/')
  }
};

module.exports = authUser;
