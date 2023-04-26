let SchedulerModel = require("../../models/SchedulerModel");
const mongoose = require('mongoose')

let getCandiate = async (req, res) => {
  try {
    let role = req.role;
    const schedulerId = [mongoose.Types.ObjectId(req.user_id)]
   
    let FromDate, ToDate;
    if (role !== "hr") {
      res.render("pages/401", { role: role });
    }
    // Check if fromDate and toDate are valid
    if (!isNaN(Date.parse(req.query.fromDate))) {
      FromDate = new Date(req.query.fromDate).toISOString().slice(0, 16);
    }
    if (!isNaN(Date.parse(req.query.toDate))) {
      ToDate = new Date(req.query.toDate+ "T23:59").toISOString().slice(0, 16);
    }
    const query = {
      interview_scheduler_id: {
        $in: schedulerId,
      },
    };


    if (FromDate && ToDate) {
      query.interview_start_date_time = {
        $gte: FromDate,
        $lte: ToDate,
      };
    }
    // console.log("query>>", query ,"DATE>>", FromDate , ToDate)

    let get_all_canddidate = await SchedulerModel.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "candidates",
          foreignField: "_id",
          localField: "interview_candidate_id",
          as: "candidate_details",
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "interview_interviewer_id",
          as: "interviewer_details",
        },
      },
      {
        $sort: {
          interview_start_date_time: 1,
        },
      },
    ]);


    let interviewer_names = [];
    for (let i = 0; i < get_all_canddidate.length; i++) {
      let newArr = [];
      for (
        let j = 0;
        j < get_all_canddidate[i].interviewer_details.length;
        j++
      ) {
        if (get_all_canddidate[i].interviewer_details[j]) {
          newArr.push(
            `${get_all_canddidate[i].interviewer_details[j].user_first_name} ${get_all_canddidate[i].interviewer_details[j].user_last_name}`
          );
        }
      }
      newArr = newArr.join(", ");
      interviewer_names.push(newArr);
    }

    // console.log(get_all_canddidate);
    //res.send({data:get_all_canddidate})
    res.render("pages/candidate", {
      candidate_details: get_all_canddidate,
      interviewer_name: interviewer_names,
      role: role,
    });
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: 501, data: {}, message: error.message });
  }
};

module.exports = getCandiate;
