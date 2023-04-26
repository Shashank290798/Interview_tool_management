const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController/userController.js");
// const middleware = require("../../middleware/isAuthMiddleware");
// const createJWT = require("../../middleware/authentication");
// const User = require("../../models/userModel");
// const createExperince = require("../../controller/userController/experienceController");
// const category = require("../../controller/userController/formController");
// const auth = require("../../middleware/isAuthMiddleware");
// const { uploadRes, uploadCategory } = require("../../middleware/multer");

// // Create new user by SuperAdmin
router.post("/signup", userController.signUp);

// route for checking for valid user logging in
router.get("/google/success", userController.checkUser);

// // POST method for adding a new HR
// router.post("/addHr", auth, userController.addHr);

// // POST method for adding a new interviewer
// router.post("/addInterviewer", auth, userController.addInterviewer);

// // GET method for adding a new technology
// router.get("/addTechnology", (req, res) => {
//   res.render("pages/technologies");
// });

// // DELETE method for deleting an HR by ID
// router.delete("/hrDelete/:id", auth, userController.deleteHr);

// // POST method for updating an HR by ID
// router.post("/hrUpdate/:id", auth, userController.updateHr);

// // Router for updating an interviewer
// router.post(
//   "/interviewersUpdate/:id",
//   auth,

//   userController.updateInterviewer
// );

// // Router for deleting an interviewer
// router.delete(
//   "/interviewers/:id",
//   auth,

//   userController.deleteInterviewer
// );
// router.get("/checkEmail", userController.checkEmail);

// router.post("/createExperience", auth, createExperince);

// router.post(
//   "/createForm",
//   uploadCategory.single("file"),
//   auth,
//   category.createCategory
// );

// router.get("/judgementForm", auth, category.getJugementForm);

// // router.get('/form', auth, category.getJugementForm_submit);

// router.get("/getForm", auth, category.getForm);

// router.post("/formSubmission/:category_id", auth, category.postForm);

module.exports = router;
