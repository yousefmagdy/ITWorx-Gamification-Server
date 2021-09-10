const { v4: getuuid } = require("uuid");
let { loggedTokens } = require("./authentication");
const verifytoken = (token) => {
  return true;
};

const userAuth = (req, res, next) => {
  console.log("userAuth", loggedTokens);
  if (req.originalUrl == "/login") {
    next();
    return;
  }
  let auth = req.signedCookies["auth"];
  console.log("auth cookie", auth);
  if (!auth) {
    res.status(403).send("unathorized");
    return;
  } else {
    let accesstoken = auth["token"];
    if (!accesstoken | !verifytoken(accesstoken)) {
      res.status(403).send("unathorized");
      return;
    } else {
      next();
    }
  }
};

module.exports = userAuth;
