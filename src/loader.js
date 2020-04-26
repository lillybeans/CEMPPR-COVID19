const mysqlConnection = require("./connection")

function fetchSurveys(callback){
  mysqlConnection.query("SELECT survey from Responses", (error, rows, fields) => {
    if(error) {
      console.log(error)
      return
    }

    const allSurveys = rows.map(row => row.survey)
    callback(allSurveys)
  })
}

module.exports = this
