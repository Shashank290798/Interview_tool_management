const fs = require("fs");
const winston = require("winston");

const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const now = new Date();

// Winston logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      name: "exceptions",
      filename: "./logs/exceptions.log",
      level: "error",
      json: false,
    }),
    new winston.transports.File({ filename: './logs/combined.log', level: "info"}),
    new winston.transports.File({ filename: './logs/warning.log', level: "warn"}),

    new (require("winston-daily-rotate-file"))({
      filename: `${logDir}/-apimodules.log`,
      timestamp: now,
      datePattern: "DD-MM-YYYY",
      prepend: true,
      json: false,
      level:"info",
    }),
  ],
  exitOnError: false,
});

module.exports = logger;