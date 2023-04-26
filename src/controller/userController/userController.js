const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const transporter = require("../../utils/email");
const Technology = require("../../models/addTechnologies");
const logger = require("../../utils/logger")
const configs = require("../../config/config");
const Candidate = require("../../models/addCandidate");
const mongoose = require("mongoose");
const Schedule = require("../../models/SchedulerModel");

exports.signUp = async (req, res) => {
  try {
    const {
      user_first_name,
      user_last_name,
      user_email,
      user_role,
      user_available_timeslots,
      user_technology,
    } = req.body;

    // Input validation
    if (
      !user_first_name ||
      !user_last_name ||
      !user_email ||
      !user_role ||
      !user_available_timeslots ||
      !user_technology
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // convert to lowercase
    const lowercaseUserRole = user_role.toLowerCase();
    if (!["hr", "interviewer", "superadmin"].includes(lowercaseUserRole)) {
      return res.status(400).json({ message: "Invalid user role" });
    }

    // Validate user_available_timeslots as an array of valid Date objects
    const validTimeSlots = user_available_timeslots.every((timeSlot) => {
      const date = new Date(timeSlot);
      return !isNaN(date.getTime());
    });

    if (!validTimeSlots) {
      return res
        .status(400)
        .json({ message: "Invalid user available timeslots" });
    }

    const user = new User({
      user_first_name,
      user_last_name,
      user_email,
      user_role: lowercaseUserRole,
      user_available_timeslots,
      user_technology,
    });
    logger.info(user)

    const result = await user.save();

    res.json({ message: "User created successfully", data: result });
  } catch (err) {
    if (err.code === 11000) {
      // console.warn(err)
      // Duplicate key error
      return res
        .status(400)
        .json({ message: "Email address is already taken enter new" });
    } else {
      // Other error
      res.status(500).json({ message: err.message });
    }
  }
};
const generateToken = (user) => {
  const token = jwt.sign(
    {
      role: user.user_role,
      name: user.user_first_name + " " + user.user_last_name,
    },
    process.env.SECRET_KEY || "shashank",
    { expiresIn: "1h" }
  );
  return token;
};
exports.checkUser = (req, res) => {
  res.redirect("/home");
};
exports.addHr = async (req, res) => {
  try {
    const { user_first_name, user_last_name, user_email } = req.body;

    // Input validation
    if (!user_first_name || !user_last_name || !user_email) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Check if the email id already exists in the database
    let existingUser = await User.findOne({ user_email });

    if (existingUser && existingUser.user_is_deleted) {
      // If the email id already exists in the database and is soft-deleted,
      // update the user to set is_deleted to false and other fields to the new values
      const result = await User.findByIdAndUpdate(
        existingUser._id,
        {
          $set: {
            user_first_name,
            user_last_name,
            user_role: "hr",
            user_is_deleted: false,
          },
        },
        { new: true }
      );
      if (!result) {
        throw new Error("Error updating user");
      }
    } else {
      // If the email id does not exist in the database,
      // create a new user with the given details
      const newUser = new User({
        user_first_name,
        user_last_name,
        user_email,
        user_role: "hr",
        user_is_deleted: false,
      });

      logger.info(newUser)

      const result = await newUser.save();
      

      const mailOptions = {
        from: process.env.EMAIL_PORT || configs.EMAIL_PORT,
        to: user_email,
        subject: "Welcome to our platform!",
        html: `<p>Hi ${user_first_name} ${user_last_name},</p><br>
               <p>Welcome to our platform!</p>
               <p>To login to your account, please use your email address ${user_email} as your login credential.</p><br>
              <p>Best regards,<br>The Platform Team</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    res.redirect("/hr");
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.addInterviewer = async (req, res) => {
  try {
    const {
      user_first_name,
      user_last_name,
      user_email,
      user_technology,
      start_time,
      end_time,
    } = req.body;

    // Input validation
    if (
      !user_first_name ||
      !user_last_name ||
      !user_email ||
      !user_technology
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let existingUser = await User.findOne({ user_email });

    if (existingUser && existingUser.user_is_deleted) {
      // If the email id already exists in the database and is soft-deleted,
      // update the user to set is_deleted to false and other fields to the new values
      const result = await User.findByIdAndUpdate(
        existingUser._id,
        {
          $set: {
            user_first_name,
            user_last_name,
            user_technology,
            user_role: "interviewer",
            user_is_deleted: false,
            user_available_timeslots: [start_time, end_time],
          },
        },
        { new: true }
      );

      if (!result) {
        throw new Error("Error updating user");
      }
    } else if (existingUser) {
      // If the email id already exists in the database and is not soft-deleted,
      // throw an error indicating that the email is already taken
      throw new Error(
        "Email address is already taken. Enter a new email address"
      );
    } else {
      // If the email id does not exist in the database,
      // create a new user with the given details
      const newUser = new User({
        user_first_name,
        user_last_name,
        user_email,
        user_role: "interviewer",
        user_technology,
        user_available_timeslots: [start_time, end_time],
      });

      const result = await newUser.save();

      const mailOptions = {
        from: process.env.EMAIL_PORT || configs.EMAIL_PORT,
        to: user_email,
        subject: "Welcome to our platform!",
        html: `<p>Hi ${user_first_name} ${user_last_name},</p><br>
      <p>Welcome to our platform!</p><br>
      <p>To login to your account, please use your email address ${user_email} as your login credential.</p><br>
      <p>Best regards,<br>The Platform Team</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    res.redirect("/interviewer");
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
exports.getInterviewer = async (req, res) => {
  try {
    let role = req.role;
    if (role !== "superadmin") {
      res.render("pages/401", { role: role });
    }
    const id = req.params.id;
    const interviewer = await User.findById(id);
    const technology = await Technology.find({ isDeleted: false });

    if (!interviewer) {
      return res.status(404).json({ message: "interviewer not found" });
    }

    res.render("pages/editInterviewer", {
      interviewer: interviewer,
      technology: technology,
      role: role,
    });
  } catch (err) {
    let role = req.role;
    res.render("pages/500", { role: role });
  }
};

exports.deleteHr = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await User.findByIdAndUpdate(
      id,
      { user_is_deleted: true },
      { new: true }
    );

    if (!result) {
      throw new Error("User not found");
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting HR" });
  }
};

exports.updateHr = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(req.body);
    const hr = await User.findById(id);

    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }

    hr.user_first_name = req.body.user_first_name || hr.user_first_name;
    hr.user_last_name = req.body.user_last_name || hr.user_last_name;
    hr.user_email = req.body.user_email || hr.user_email;

    const updatedHr = await hr.save();
    res.redirect("/hr");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInterviewer = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewer = await User.findById(id);
    if (!interviewer) {
      return res.status(404).json({ error: "Interviewer not found" });
    }

    // Update the interviewer fields
    interviewer.user_first_name =
      req.body.user_first_name || interviewer.user_first_name;
    interviewer.user_last_name =
      req.body.user_last_name || interviewer.user_last_name;
    interviewer.user_email = req.body.user_email || interviewer.user_email;
    interviewer.user_technology =
      req.body.user_technology || interviewer.user_technology;
    interviewer.user_available_timeslots = [
      req.body.start_time || interviewer.user_available_timeslots[0],
      req.body.end_time || interviewer.user_available_timeslots[1],
    ];

    // Save the updated interviewer
    const updatedInterviewer = await interviewer.save();
    res.redirect("/interviewer");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller for deleting an interviewer
exports.deleteInterviewer = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if interviewer exists
    const interviewer = await User.findByIdAndUpdate(
      id,
      { user_is_deleted: true },
      { new: true }
    );
    if (!interviewer) {
      return res.status(404).json({ error: "Interviewer not found" });
    }
    res.json({ message: "Interviewer deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.listInterviewer = async (req, res) => {
  try {
    let role = req.role;
    const interviewerList = await User.find({
      user_role: "interviewer",
      user_is_deleted: false,
    });
    //console.log(interviewerList);
    res.render("pages/ilistinterviewer", {
      interviewerList: interviewerList,
      role: role,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.checkEmail = async (req, res) => {
  const { email } = req.query;
  const interviewer = await User.findOne({
    user_email: { $regex: new RegExp(`^${email}$`, "i") },
    user_is_deleted: false,
  });
  res.json({ isEmailExists: !!interviewer });
};

exports.decline = async (req, res) => {
  const interviewId = req.params.interviewId;
  // console.log(interviewId);

  try {
    const schedule = await Schedule.findById(interviewId);
    schedule.interview_status = "DECLINED";
    await schedule.save();
    // console.log(schedule);
    res.redirect("/getShedules");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const interviewerId = [mongoose.Types.ObjectId(req.user_id)];
    const role = req.role;
    let FromDate, ToDate;

    // Check if fromDate and toDate are valid
    if (!isNaN(Date.parse(req.query.fromDate))) {
      FromDate = new Date(req.query.fromDate).toISOString().slice(0, 16);
    }
    if (!isNaN(Date.parse(req.query.toDate))) {
      ToDate = new Date(req.query.toDate+ "T23:59").toISOString().slice(0, 16);
    }

    // console.log(FromDate, ToDate);
    const query = {
      interview_interviewer_id: {
        $in: interviewerId,
      },
    };

    if (FromDate && ToDate) {
      query.interview_start_date_time = {
        $gte: FromDate,
        $lte: ToDate,
      };
    }

    const schedules = await Schedule.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "candidates",
          localField: "interview_candidate_id",
          foreignField: "_id",
          as: "candidate_details",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "interview_interviewer_id",
          foreignField: "_id",
          as: "interviewer_details",
        },
      },
      {
        $sort: {
          interview_start_date_time: 1,
        },
      },
    ]);

    console.log(schedules);
    res.render("pages/shedules", { schedules, role, interviewerId });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error while fetching schedules.");
  }
};
