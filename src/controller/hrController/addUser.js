const userModel = require("../../models/userModel");
const ical = require("ical-generator");
const transporter = require("../../utils/email");
const moment = require("moment");

let addUser = async (req, res) => {
  //   let result = await userModel.create(req.body);
  
    let cal = ical({
      domain: "mytestwebsite.com",
      name: "My test calendar event",
    });
    // cal.domain("mytestwebsite.com");
    cal.createEvent({
      start: moment(), // eg : moment()
      end: moment(1, "days"), // eg : moment(1,'days')
      summary: "meet.google.com/pmx-tssk-cpc", // 'Summary of your event'
      description: "More description  meet.google.com/pmx-tssk-cpc des", // 'More description'
      location: "Delhi", // 'Delhi'
      url: "meet.google.com/pmx-tssk-cpc", // 'event url'
        organizer: {
          // 'organizer details'
          name: "harshit",
          email: "harshit.j@webvillee.in",
        },
    });

    mailOptions = {
      to: `${req.body.user_email}`,
      subject: `calendar invitation`,
      html: `
      //       <p>
      //       </p> Calendar invite</br>

      //       Thanks and Regards<br>
      //       Webvillee Technology Pvt Ltd<br>
      //       Indore (M.P.)
      //       </p>

      //       `,
    };
    if (cal) {
      let alternatives = {
        "Content-Type": "text/calendar",
        method: "ADD",
        content: new Buffer.from(cal.toString()),
        component: "VEVENT",
        "Content-Class": "urn:content-classes:calendarmessage",
      };
      mailOptions["alternatives"] = alternatives;
      mailOptions["alternatives"]["contentType"] = "text/calendar";
      mailOptions["alternatives"]["content"] = new Buffer.from(cal.toString());
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error  :", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    let mailOptionFrom = {
      from: "krawebvillee@gmail.com",
      to: `${req.body.user_email}`,
      subject: `calendar invitation`,
      html: `
        <p>

        </p> </br>

        Thanks and Regards<br>
        Webvillee Technology Pvt Ltd<br>
        Indore (M.P.)
        </p>

        `,
    };

    transporter.sendMail(mailOptionFrom, (error, info) => {
      if (error) {
        console.log("error  :", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

  res.send("mail sent");
};

module.exports = addUser;
