const mongoose = require("mongoose");
let ObjectId = mongoose.Schema.Types.ObjectId;
// Creating the candidate schema
const candidateSchema = new mongoose.Schema({
  candidate_first_name: {
    type: String,
    required: true,
  },
  candidate_last_name: {
    type: String,
    required: true,
  },
  candidate_technology: {
    type: Array,
    required: true,
  },
  candidate_email:{
    type:String,
    required:true,
    trim:true
  },
  candidate_experience: {
    type: Number,
    required: true,
  },
  judgement_form_id:{
    type:ObjectId,
    required:true
  },
  candidate_notes: {
    type: String,
    maxlength: 250
  },
  candidate_resume: {
    type: String,
    required: true,
  },
  candidate_created_at: {
    type: Date,
    default: new Date(),
  },
  candidate_updated_at: {
    type: Date,
    default: null,
  },
});

// Creating the candidate model
const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
