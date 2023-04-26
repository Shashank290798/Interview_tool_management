const nodemailer = require("nodemailer");
const configs = require("../config/config");
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
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
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.use('compile', hbs({
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve('./src/views/email'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./src/views/email'),
  extName: ".handlebars",
}))

module.exports = transporter;


