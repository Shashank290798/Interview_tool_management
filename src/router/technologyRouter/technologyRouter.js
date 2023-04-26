const express = require("express");
const router = express.Router();
const technologyController = require("../../controller/technologyController/technologyController");
const auth = require("../../middleware/isAuthMiddleware");
// POST method for adding technology
router.post("/addTechnology", auth, technologyController.addTechnology);

// GET method for getting a list of technologies
router.get("/technologies", auth, technologyController.getList);

// GET method for getting a specific technology
router.get("/addInterviewer", auth, technologyController.getTechnology);

// PUT method for editing a technology
router.post("/editTechnology", auth, technologyController.editTechnology);

// DELETE method for deleting a technology
router.delete("/deleteTech/:id", auth, technologyController.deleteTechnology);

module.exports = router;
