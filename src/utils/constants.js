const success = {
  DATABASE_CONNECTED_SUCCESSFULLY: "Database Connected Successfully",
  SERVER_RUNN: "Server Running on",
  SUCCESS:"Data Added Successfully"
};

const error = {
  TOKEN_ERROR: "You have been logged out please log in again",
  EMAIL_EXIST: "A user had already been registered with this email.",
  ALREADY_USER: "User already exists",
  NOTREG: "User not Registered",
  INVALIDCRED: "Invalid Credentials",
  NOT_AUTH: "You are Not Authorized to access this Route",
  NO_EXPERIENCE_LEVEL:"Please Provide Experince levels",
  DUPLICATE_EXPERIENCE:"Document with this experience is alteday exist",
  NO_FILE:"please select a file to upload",
  NO_DATA_FOUND:'No data Found in the sheet',
  DOC_EXIST:"Already a Document exist for the given Experience level"
};

const roles = {
  1: "hr",
  2: "interviewer",
  3: "superadmin"
};

module.exports = {
  success,
  error,
  roles,
};
