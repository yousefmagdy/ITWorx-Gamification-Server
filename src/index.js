const express = require("express");
var path = require("path");
var fs = require("fs"); //file system
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();
const userAuth = require("./userAuth");

const app = express();
app.use(
  cors({
    origin: process.env.React_Server_Origin,
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.cookie_HMAC_secret));
app.use(userAuth);

require("./authentication").routes(app);
const db = require("./databaseService");

app.get("/", (req, res) => {
  // console.log(req.cookies);
  res.json({ message: "From the Node Server !" });
});

app.get("/db", (req, res) => {
  db.query("SELECT * FROM `Employee`", function (err, results, fields) {
    console.log(results); // results contains rows returned by server
    res.send(results);
  });
});
//
app.get("/AllActivities", (req, res) => {
  console.log(
    "sending all activities data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query("SELECT * FROM `Activity`", function (err, results, fields) {
    // console.log(fields);
    res.json(results);
  });
  // res.send(res.data);
});

app.get("/NewActivities", (req, res) => {
  const currentDate = new Date().toLocaleTimeString("en-US", {
    timeZone: "Egypt",
  });
  console.log("sending New Activities", currentDate);
  db.query(
    "SELECT * FROM Activity WHERE startDate > DATE_ADD(CURDATE(), INTERVAL -3 DAY)",
    function (err, results, fields) {
      res.json(results);
    }
  );
});

app.post("/YourActivities", (req, res) => {
  console.log(
    "sending Your activities data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(
    `SELECT * FROM Activity inner join EmployeeSubActivity on Activity.id = EmployeeSubActivity.ActivityId WHERE EmployeeSubActivity.EmployeeId = ${req.body.employeeId}`,
    function (err, results, fields) {
      res.json(results);
    }
  );
});
app.post("/EmployeeDepartments", (req, res) => {
  console.log(
    "sending employee departments data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(
    `SELECT * FROM EmployeeWorkDepartment WHERE EmployeeWorkDepartment.employeeId = ${req.body.employeeId}`,
    function (err, results, fields) {
      res.json(results);
    }
  );
});
app.post("/EmployeeGainedBadges", (req, res) => {
  console.log(
    "sending employee Gained Badges data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(
    `SELECT * FROM EmployeeGainBadge INNER JOIN Badge WHERE EmployeeGainBadge.employeeId = ${req.body.employeeId}`,
    function (err, results, fields) {
      res.json(results);
    }
  );
});
app.get("/EmployeeRanking", (req, res) => {
  console.log(
    "sending employee Rankings data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(`SELECT * FROM EmployeeRanking`, function (err, results, fields) {
    res.json(results);
  });
});
app.get("/PracticeRanking", (req, res) => {
  console.log(
    "sending Practice Rankings data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(`SELECT * FROM PracticeRanking`, function (err, results, fields) {
    res.json(results);
  });
});

app.get("/DepartmentRanking", (req, res) => {
  console.log(
    "sending Departments Ranking data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(`SELECT * FROM DepartmentRanking`, function (err, results, fields) {
    res.json(results);
  });
});

app.post("/AddActivity", (req, res) => {
  console.log(req.body);
  //
  // db.query(
  //   "SELECT * FROM Activity inner join EmployeeSubActivity on Activity.id = EmployeeSubActivity.ActivityId",
  //   function (err, results, fields) {
  //     res.json(results);
  //   }
  // );
});

const handleDbError = (err) => {
  console.log(err);
};

const port = process.env.PORT || 8080;
db.on("error", handleDbError);

app.listen(port, () =>
  console.log(`server is listening at http://localhost:${port}`)
);
