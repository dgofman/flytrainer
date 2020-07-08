var env = require("../../environment.json");

const PROXY_CONFIG = {
  "**": {
    "target": env.endpoint,
    "secure": false,
    "bypass": function (req) {
      if (req && req.headers && req.headers.accept && req.headers.accept.indexOf("html") !== -1) {
        console.log("Skipping proxy for browser request.");
        return "/index.html";
      }
    }
  }
};

// tslint:disable-next-line
module.exports = PROXY_CONFIG;