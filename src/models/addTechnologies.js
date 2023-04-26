// Technology Model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TechnologySchema = new Schema({
  technology_name: {
    type: String,
    required: true,
    unique: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Technology = mongoose.model("Technology", TechnologySchema);

module.exports = Technology;