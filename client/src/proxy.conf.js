var env = require("./environments/environment.json");

const PROXY_CONFIG = {
  "/dataserver_current": {
    "target": "https://www.aviationweather.gov/adds",
    "secure": true,
    "pathRewrite": {
      "^/posts": ""
    },
    "changeOrigin": true
  },
  "/timezone": {
    "target": "http://worldtimeapi.org/api",
    "changeOrigin": true
  },
  "**": {
    "target": env.endpoint,
    "secure": env.secure,
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