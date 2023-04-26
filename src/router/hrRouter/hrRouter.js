const express = require("express");
const addUser = require("../../controller/hrController/addUser");
const getHr = require("../../controller/hrController/getHr");
const home = require('../../controller/home')
const router = express.Router();

// Hr routes

// GET method for hr
router.get("/home", home.dashboard);

router.get("/hr", getHr)

router.get("/addHr", (req, res) => {
 
res.render("pages/addHr");
});

// router.post("/addUser", addUser);

module.exports = router;
