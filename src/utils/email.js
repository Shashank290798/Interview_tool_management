const nodemailer = require("nodemailer");
const configs = require("../config/config");

// transporter for mail
let transporter = nodemailer.createTransport({
  service: process.env.SERVICE || configs.SERVICE,
  host: process.env.HOST || configs.HOST,
  port: process.env.EMAIL_PORT || configs.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_ID || configs.MAIL_ID,
    pass: process.env.MAIL_PASS || configs.MAIL_PASS,
  },
});

module.exports = transporter;