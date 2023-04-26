const candidateModel = require("../../models/addCandidate");
const SchedulerModel = require('../../models/SchedulerModel');
const userModel = require('../../models/userModel')
const ics = require("ics");
let fs = require("fs");
let transporter = require('../../utils/email');

let addCandidateByHR = async (req, res) => {
  try {
    let role = req.role
    let {
      candidate_first_name,
      candidate_last_name,
      candidate_technology,
      candidate_experience,
      interviewer,
      candiate_email,
      interview_start_dateAndTime,
      interview_end_dateAndTime,
      interview_link,
      candidate_notes,
      judgement_form_id
    } = req.body;
  //  console.log('req body -->',req.body);
    //console.log('req.file -->',req.file);
   // console.log(interview_start_dateAndTime);
   // console.log(interview_end_dateAndTime);

    let create_candidate = await candidateModel.create({
      candidate_first_name:candidate_first_name,
      candidate_last_name:candidate_last_name,
      candidate_technology:candidate_technology,
      candidate_experience:candidate_experience,
      candidate_resume:req.file.filename,
      candidate_email:candiate_email,
      candidate_notes:candidate_notes,
      judgement_form_id:judgement_form_id
    });

    
    //changing the Start Tiem Format in Array exmp - [ yyyy, mm, dd, hh, mm ]
    let start_dateAndTime = interview_start_dateAndTime;
    let start_date = start_dateAndTime.slice(0, 10);
    let start_time = start_dateAndTime.slice(11, 17);
    start_time = start_time.split(":");
    start_date = start_date.split("-");
    let start_both = [...start_date, ...start_time];
    let start_finalDateAndTime = [];
    for (let i = 0; i < start_both.length; i++) {
      if (start_both[i]) {
        start_finalDateAndTime.push(start_both[i] * 1);
      }
    }


 //changing the End Tiem Format in Array exmp - [ yyyy, mm, dd, hh, mm ]
  let end_dateAndTime = interview_end_dateAndTime;
    let end_date = end_dateAndTime.slice(0, 10);
    let end_time = end_dateAndTime.slice(11, 17);
    end_time = end_time.split(":");
    end_date = end_date.split("-");
    let end_both = [...end_date, ...end_time];
    let end_finalDateAndTime = [];
    for (let i = 0; i < end_both.length; i++) {
      if (end_both[i]) {
        end_finalDateAndTime.push(end_both[i] * 1);
      }
    }


    let attendezz = [];
    let mail_send_to = [];
    let atndzStr = []
    if(!Array.isArray(req.body.interviewer)){
      atndzStr.push(req.body.interviewer)
    }else{
      atndzStr = req.body.interviewer;
    }
     
    mail_send_to.push(candiate_email)
    attendezz.push({
      name: `${candidate_first_name} ${candidate_last_name}`,
      email: candiate_email,
      rsvp: true,
      partstat: "ACCEPTED",
      role: "REQ-PARTICIPANT",
    });

    for(let i=0;i<atndzStr.length;i++){
      if(atndzStr[i]){
        mail_send_to.push(atndzStr[i])

        attendezz.push({
          name: atndzStr[i],
          email:atndzStr[i],
          rsvp: true,
          partstat: "ACCEPTED",
          role: "REQ-PARTICIPANT",
        });
      }
    }

    //creating an ICS file
    const event = {
      start:start_finalDateAndTime,
      end:end_finalDateAndTime,
      title: "Webvillee Interview",
      description: "Technical Interview Online",
      location: "Indore, MP, India",
      url: "https://www.webvillee.com/",
      status: "CONFIRMED",
      busyStatus: "BUSY",
      organizer: { name: "Admin", email: "karthikeyareddy440@gmail.com" },
      attendees: attendezz,
      method: "REQUEST",
    };
    let val;

    ics.createEvent(event, (error, value) => {
      if (error) {
        console.log(error);
        return;
      }
      val = value;
      return "value created";
    });

    let writer = fs.createWriteStream(`inviteIcs/${create_candidate._id}.ics`);

    writer.write(val);

    //saving the scheduler to the DB in scheluer collection
    let find_interviewr_details = await userModel.find({user_email:{$in:atndzStr}});
    let interviewr_id = []
    for(let i=0;i<find_interviewr_details.length;i++){
      if(find_interviewr_details[i]){
        interviewr_id.push(find_interviewr_details[i]._id)
      }
    }
   // console.log('interview Ids ->',interviewr_id)
    let create_scheduler = await SchedulerModel.create({
      interview_candidate_id:create_candidate._id,
      interview_scheduler_id:req.user_id,
      interview_interviewer_id:interviewr_id,
      interview_start_date_time:req.body.interview_start_dateAndTime,
      interview_end_date_time:req.body.interview_end_dateAndTime,
      interview_icsFile_fleName:`${create_candidate._id}.ics`,
      interview_technology:candidate_technology,
      interview_notes:candidate_notes,
      interview_meetLink:interview_link
    });


   // sending the Mail to the attendes
     let mailOption = {
      from: "resumeapp31@gmail.com",
      to: mail_send_to, // person receiving the Email
      subject: `Calender Event`,
      attachments: [
        {
          // file on disk as an attachment
          filename: "invite.ics",
          path: `inviteIcs/${create_candidate._id}.ics`, 
        },
        {
          filename: req.file.filename,
          path: req.file.path
        }
      ],
      template:'interview',
        context:{
          candidate_first_name:candidate_first_name,
          candidate_last_name:candidate_last_name,
          candidate_technology:candidate_technology,
          start_date:start_date.reverse().join('-'),
          start_time:start_time.join('-'),
          candidate_experience:candidate_experience,
          interview_link:interview_link
        }
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.redirect("/getCandiates");
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: 501, data: {}, message: error.message });
  }
};

module.exports = addCandidateByHR;

//moment().utc(`${new Date()}`).utcOffset("+05:30");