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

var db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.pass,
  database: process.env.dbname,
  port: 3306
});

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

const port = process.env.PORT || 8080;

app.listen(port, () =>
  console.log(`server is listening at http://localhost:${port}`)
);
