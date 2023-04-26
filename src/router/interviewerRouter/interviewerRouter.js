const express = require('express')
const get= require('../../controller/userController/userController.js')
const router = express.Router()
const auth = require('../../middleware/isAuthMiddleware');

// Interviewer routes

router.get("/edit/:id", auth, get.getInterviewer)

router.get("/listInterviewer",auth , get.listInterviewer)

router.get("/getShedules",auth , get.getSchedules)


router.post("/declineInterview/:interviewId",auth,get.decline)

module.exports = router