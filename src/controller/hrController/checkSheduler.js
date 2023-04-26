let shedulerModel = require("../../models/SchedulerModel");
let userModel = require("../../models/userModel");
let checkSchedule = async (req, res) => {
  try {
  
    let { start, end, technology } = req.body;


    //finding the busy sheduled Interviewers
    let interviewer_data = await shedulerModel.aggregate([
      {
        $match: {
          interview_technology: { $in: technology },
          $or: [
            {
              interview_start_date_time: {
                $gte: start,
                $lte: end,
              },
            },
            {
              interview_end_date_time: {
                $gte: start,
                $lte: end,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "interview_interviewer_id",
          as: "interviewrDetails",
        },
      },
      {
        $project: {
          userEmial: "$interviewrDetails.user_email",
          techName: "$interviewrDetails.user_technology",
        },
      },
    ]);
    // console.log(interviewer_data);
    if (interviewer_data.length == 0) {
      start = start.split("T");
      end = end.split("T");
      let get_interviwer = await userModel.find({
        user_role: "interviewer",
        user_technology: { $in: technology },
        $and: [
          {
            "user_available_timeslots.1": {
              $gte: end[1],
            },
          },
          {
            "user_available_timeslots.0": {
              $lte: start[1],
            },
          },
        ],
      });
      // console.log("in If", get_interviwer);

      return res.send({
        status: 200,
        data: get_interviwer,
        message: "Fetched Successfully",
      });
    } else {
      //console.log("In else statement");
      start = start.split("T");
      end = end.split("T");
      let list = [];
      for (let i = 0; i < interviewer_data.length; i++) {
        if (interviewer_data[i]) {
          list.push(...interviewer_data[i].userEmial);
        }
      }

      let get_interviwer = await userModel.aggregate([
        {
          $match: {
            user_role: "interviewer",
            user_technology: { $in: technology },
            user_email: {
              $not: { $in: list },
            },
          },
        },
        {
          $match: {
            $and: [
              {
                "user_available_timeslots.1": {
                  $gte: end[1],
                },
              },
              {
                "user_available_timeslots.0": {
                  $lte: start[1],
                },
              },
            ],
          },
        },
      ]);

      // finding available interviewers
      let availableInterviewers = await userModel.find({
        user_role: "interviewer",
        user_technology: { $in: technology },
      });

      // filtering available interviewers by their timeslots
      let availableInterviewersFiltered = availableInterviewers.filter((i) => {
        // if interviewer has no available timeslots, return true
        if (
          !i.user_available_timeslots ||
          i.user_available_timeslots.length === 0
        ) {
          return true;
        }
        // else, check if interviewer has available timeslots during the requested time range
        return i.user_available_timeslots.some((slot) => {
          let slotTime = new Date(start).setHours(
            slot.split(":")[0],
            slot.split(":")[1],
            0,
            0
          );
          return (
            slotTime >= new Date(start).getTime() &&
            slotTime <= new Date(end).getTime()
          );
        });
      });

      // combine busy and available interviewers
      let finalInterviewers = [
        ...get_interviwer,
        ...availableInterviewersFiltered,
      ];
      // console.log("final", finalInterviewers);
      //console.log(get_interviwer);

      return res.send({
        status: 200,
        data: finalInterviewers,
        message: "Fetched Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({ status: 501, data: {}, message: error.message });
  }
};

module.exports = checkSchedule;
