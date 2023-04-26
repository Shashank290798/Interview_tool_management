const cluster = require("cluster");
const logger = require("./src/utils/logger");
const numCPUs = require("os").cpus().length;
const { EventEmitter } = require("events");

const eventEmitter = new EventEmitter();

if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.error(`worker ${worker.process.pid} died`);
    console.log(`worker ${worker.process.pid} died`);


    // Emit a restart event when a worker dies and a new worker is forked
    eventEmitter.emit("restart");
    cluster.fork();
  });

  // Emit a start event when all workers have been forked and the server has started
  eventEmitter.emit("start");
} else {
  const express = require("express");
  const bodyParser = require("body-parser");
  const app = express();
  const passport = require("passport");
  const session = require("express-session");
  const dotenv = require("dotenv");
  dotenv.config();
  require("./src/middleware/passportSetup");
  const cors = require("cors");
  const moment = require("moment");
  const mongodb = require("./src/database/database");
  const path = require("path");
  const msg = require("./src/utils/constants");
  const hrRouter = require("./src/router/hrRouter/hrRouter");
  const userRouter = require("./src/router/userRouter/userRouter");
  const technologyRouter = require("./src/router/technologyRouter/technologyRouter");
  const userModel = require("./src/models/userModel");
  const interviewerRouter = require("./src/router/interviewerRouter/interviewerRouter");
  const configs = require("./src/config/config");
  const cookieParser = require("cookie-parser");
  const jwt = require("jsonwebtoken");
  const authUser = require("./src/middleware/isAuthMiddleware");
  const loginPage = require("./src/controller/loginPage");
  const auth = require("./src/middleware/isAuthMiddleware");
  const logger = require("./src/utils/logger");

  // set up session
  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
  );

  // initialize passport and passport session
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.userRole = req.session.userRole || "";
    next();
  });

  // mongoDB connection
  mongodb.createDbConnection();

  // Setting for the root path for views directory
  app.set("views", "./src/views");

  // Setting the view engine
  app.set("view engine", "ejs");

  // Setting for the root path for public directory
  app.use("/static", express.static(path.join(__dirname, "./src/static")));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());

  app.use(
    cors({
      origin: "*",
    })
  );

  // routes
  app.use("/", hrRouter);
  app.use("/", interviewerRouter);
  app.use("/", userRouter);
  app.use("/", technologyRouter);

  // login route
  // app.use('/', loginPage);
  app.get("/", (req, res) => {
    res.render("pages/login");
  });

  // route for Google authentication
  app.get(
    "/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  );

  app.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/google/success",
      failureRedirect: "/google",
    })
  );

  app.get("/logout", (req, res) => {
    req.logout((err) => {
      // console.log("logOut called");
      if (err) {
        console.log(err);
      }
      res.clearCookie("connect.sid");
      res.clearCookie("jwt");
      res.redirect("/");
    });
  });

  app.get("*", auth, (req, res) => {
    try {
      let role = req.role;
      res.render("pages/404", { role: role });
    } catch (error) {
      res.render("pages/500", { role: role });
    }
  });

  let port = process.env.PORT || configs.PORT;

  const server = app.listen(port, () => {
    logger.info(msg.success.SERVER_RUNN, port);
    console.log(msg.success.SERVER_RUNN, port);
  });

  // Emit a ready event when the server is ready to accept requests
  server.on("listening", () => {
    eventEmitter.emit("ready");
  });
}
