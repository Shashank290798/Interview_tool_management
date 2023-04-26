const jwt = require("jsonwebtoken");
const configs = require("../../src/config/config");
const logger = require("../utils/logger");

// JWT verify auth middleware
const authUser = (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    let verify = jwt.verify(
      token,
      process.env.SECRET_KEY || configs.SECRET_KEY
    );
    if (verify) {
      next();
    } else {
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = authUser;
