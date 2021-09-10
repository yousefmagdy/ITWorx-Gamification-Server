var mysql = require("mysql2");

let db;
db_config = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.pass,
  database: process.env.dbname,
  port: 3306,
  dateStrings: "date",
};
db = mysql.createConnection(db_config);

function handleDisconnect() {
  // Recreate the connection, since
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

module.exports = db;
