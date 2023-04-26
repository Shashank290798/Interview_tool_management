const express = require("express");
const addUser = require("../../controller/hrController/addUser");
const addCandidateByHR = require("../../controller/hrController/addCandidate");
const getHome = require("../../controller/hrController/getHome");
const getHr = require('../../controller/hrController/getHr');
const getInterviewer = require('../../controller/interviewerController/getInterviewer');
const getCandiate = require('../../controller/hrController/getCandidate')
const technology = require('../../controller/technologyController/technologyController')
const getCandidateForm = require('../../controller/hrController/addCandidateForm');
const {uploadRes, uploadCategory}= require('../../middleware/multer');
const checkSchedule = require('../../controller/hrController/checkSheduler');
const auth = require('../../middleware/isAuthMiddleware');
const schedule = require('../../controller/hrController/cancleSchedule')

const createHr = require("../../controller/userController/userController.js");
const resumeDownload = require('../../controller/hrController/downloadResume')
const router = express.Router();

/// GET method for homepage
router.get("/home",auth , getHome.dashboard);

// GET method for HR page
router.get("/hr", auth, getHr.getHrDetails);

router.get("/listCandidate" , auth , getHr.listCandidate)

router.get("/hrList", auth, getHr.listHrDetails);

router.get("/editHr/:id", auth, getHr.editHr)

// GET method for adding HR
router.get("/addHr", auth, (req, res) => {
    let role = req.role
    if(role !== 'superadmin'){
        return res.render('pages/401',{role: role})
       }
res.render("pages/addHr",{ role: role});
});

// GET method for adding Interviewer
router.get("/addInterviewer", auth, technology.getTechnology);

// GET method for Interviewer page
router.get("/interviewer", auth, getInterviewer);

// POST method for adding user
router.post("/addUser", addUser);

router.post("/addCandidate", uploadRes.single('file'), auth,  addCandidateByHR);

router.get('/getCandiates', auth,  getCandiate);

router.get('/addCandiateForm', auth, getCandidateForm);

router.post('/checkSchedule', checkSchedule);

router.get('/resumeDownload', auth, resumeDownload);

router.patch('/cancleSchedule/:candidateId', auth, schedule.cancleSchedule);

router.get('/cancelationDetails/:id',auth, schedule.getDetialsOfCancellation);

module.exports = router;
