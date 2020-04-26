const mysqlConnection = require("./connection")

function fetchSurveys(callback){
  mysqlConnection.query("SELECT DISTINCT Poll_Name from Responses", (error, rows, fields) => {
    if(error) {
      console.log(error)
      return
    }

    const pollNames = rows.map(row => row.Poll_Name)
    callback(pollNames)
  })
}

module.exports = {
  fetchSurveys: fetchSurveys
}
