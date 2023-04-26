const mongoose = require("mongoose");
const configs = require("../config/config");
const msg = require("../utils/constants");

let url ="mongodb://0.0.0.0:27017/interview" ;

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.set("strictQuery", true);

// function for mongoDB connection
const createDbConnection = () => {
  mongoose
    .connect(url, connectionOptions)
    .then(() => {
      console.log(msg.success.DATABASE_CONNECTED_SUCCESSFULLY);
    })
    .catch((error) => console.error(error));
};

module.exports = {
  createDbConnection,
};