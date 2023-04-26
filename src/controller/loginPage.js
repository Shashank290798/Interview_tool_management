const logger = require("../utils/logger");

// For rendering login page
let loginPage = async (req, res) => {
  try {
    res.render("pages/login");
  } catch (error) {
    logger.error(error)
  }
};

module.exports = loginPage;
