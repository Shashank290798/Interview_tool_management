const logger = require("../../utils/logger");

// Get request for Hr
let getHr = async (req, res) => {
  try {
    res.render("pages/hr");
  } catch (error) {
    logger.error(error)
  }
};

module.exports = getHr;
