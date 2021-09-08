const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
var mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

//create express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;
db_config = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.pass,
  database: process.env.dbname,
  port: 3306,
  dateStrings: "date",
};

function handleDisconnect() {
  db = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  db.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  db.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();

app.get("/", (req, res) => {
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


app.post("/AddNewCycle", (req, res) => {
  console.log(req.body);

});

app.post("/EditCycle", (req, res) => {
  console.log(req.body);

});

app.post("/EditBadge", (req, res) => {
  console.log(req.body);

});


app.post("/CreateBadge", (req, res) => {
  console.log(req.body);

});

const handleDbError = (err) => {
  console.log(err);
};

const port = process.env.PORT || 8080;
db.on("error", handleDbError);

app.listen(port, () =>
  console.log(`server is listening at http://localhost:${port}`)
);
