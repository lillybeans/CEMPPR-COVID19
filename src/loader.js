const mysqlConnection = require("./connection")

/**
TODO:
After data migration, setup separate tables for:
- surveys
- groups
- themes
- population
- countries
**/

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
