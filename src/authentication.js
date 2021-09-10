const TokenGenerator = require("uuid-token-generator");
const tokgen = new TokenGenerator();
const moment = require("moment");
const db = require("./databaseService");

const allowedLoggedTime = 60 * 1000;

let loggedTokens = [];

const verifyCredetials = async (email, password) => {
  let wrongCredentials = true;
  let isAdmin = false;

  db.connect();

  let dbresult = "nothing";
  await db
    .promise()
    .query(
      "SELECT * FROM `Employee` WHERE isActive=true AND email=? AND password=?",
      [email, password]
    )
    .then((res) => {
      dbresult = res[0];
    })
    .catch((err) => console.log(err));

  console.log("dbresult", dbresult);
  if (dbresults.length == 1) {
    return { True, False };
  } else {
    // might be in the admin table
  }
  if (email === dbresult[0].email && password === dbresult[0].password) {
    return { False, False };
  }

  return { wrongCredentials, isAdmin };
};

function routes(app) {
  app.post("/login", function (req, res) {
    try {
      console.log("loggin", req.body);
      var email = req.body.email;
      var password = req.body.password;
      email = email.toLowerCase();
      const { wrongCredentials, isAdmin } = verifyCredetials(email, password);
      if (wrongCredentials) throw new Error();

      let authinfo = {
        token: tokgen.generate(),
        isAdmin: isAdmin,
        expires: moment(Date.now()).add(allowedLoggedTime, "ms").valueOf(),
      };

      res.cookie("auth", authinfo, {
        signed: true,
        maxAge: allowedLoggedTime,
      });

      loggedTokens.push(authinfo);
      res.status(200).send("OK");
    } catch (error) {
      res.status(403).send("unathorized");
    }
  });
  app.post("/logout", (req, res) => {
    console.log("logging out");
    console.log("cookie", req.signedCookies["auth"]);

    res.clearCookie("auth");
    res.status(200).send("OK");
  });
}
// Clean up expired tokens
function cleanupLoggedTokens() {
  loggedTokens = loggedTokens.filter((elm) => elm.expires > Date.now());
}
setInterval(cleanupLoggedTokens, 30 * 60); // every half hour

module.exports = { routes, loggedTokens };
