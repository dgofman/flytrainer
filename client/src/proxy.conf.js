var env = require("./environments/environment.json");
var proxy = require("./environments/proxy-config.json");

module.exports = Object.assign(proxy, {
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
});