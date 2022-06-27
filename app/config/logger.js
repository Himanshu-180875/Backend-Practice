const log4js = require("log4js");
log4js.configure({
  appenders: {
    app: { type: "file", filename: "app.log" },
    console: { type: "stdout" },
    
  },
  categories: { default: { appenders: ["app", "console"], level: "debug" } },
});

const logger = log4js.getLogger();
module.exports = logger;
