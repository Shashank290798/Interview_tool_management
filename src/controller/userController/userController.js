const User = require('../../models/userModel')


exports.checkUser = (req, res) => {
  res.redirect("/home");
};

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
    if (!["superadmin"].includes(lowercaseUserRole)) {
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
    // logger.info(user);

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
