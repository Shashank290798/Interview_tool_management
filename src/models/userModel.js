const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_first_name: {
    type: String,
    required: true,
  },
  user_last_name: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
  },
  user_role: {
    type: String,
    enum: ["hr", "interviewer", "superadmin"],
  },
  user_technology: {
    type: [String],
  },
  user_available_timeslots: {
    type: [String],
  },
  user_is_deleted: {
    type: Boolean,
    default: false,
  },
  user_created_at: {
    type: Date,
    default: new Date(),
  },
  user_updated_at: {
    type: Date,
    default: new Date(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
