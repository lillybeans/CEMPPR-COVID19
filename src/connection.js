const mysql = require("mysql")

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cemppr",
  database: "COVID19PollTracker",
  multipleStatements: true,
  dateStrings: true
})

mysqlConnection.connect( (error) => {
  if (!error){
    console.log("Connection successful")
  } else {
    console.log(error)
  }
})

module.exports = mysqlConnection
