const mysqlConnection = require("./connection")

//Promisified MYSQL queries
function queryPromise(sql) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query(sql, (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows);
    });
  });
}

function fetchNumberOfSurveysPromise(){
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT COUNT(*) AS count FROM Surveys", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows[0].count);
    });
  });
}

function fetchSurveysByPagePromise(page){
  var rowsOffset = (page - 1)*10
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Surveys LIMIT 10 OFFSET " + rowsOffset, (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows);
    });
  });
}

/** Survey Parameters **/

function fetchCountries(){
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Countries", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.name));
    });
  });
}

function fetchPopulations(){
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Population", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.name));
    });
  });
}

function fetchLanguages(){
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Language", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.name));
    });
  });
}

function fetchSampleMethods(){
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM SampleMethods", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.name));
    });
  });
}

function fetchTypeofStudies(){
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM TypeOfStudy", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.name));
    });
  });
}

function closePromise() {
  return new Promise((resolve, reject) => {
    mysqlConnection.end(err => {
      if (err)
        return reject(err);
      resolve();
    });
  });
}

function fetchSubmitQuestionDataPromise() {
  //1. Section 1: Choose Survey - fetch surveys for dropdown
  //2. Section 2: Group, Theme, Keywords
  let dict
  return fetchPollNamesPromise().then(pollNames => {
      dict["pollNames"] = pollNames
      //return queryPromise( 'SELECT * FROM Group' );
    })
    // .then( rows => {
    //     otherRows = rows;
    //     groups = rows.map(row => row.Group)
    //     return database.close();
    // }, err => {
    //     return database.close().then( () => { throw err; } )
    // } )
    // .then( () => {
    //     // do something with someRows and otherRows
    // })
    .catch(err => {
      // handle the error
    })
}

module.exports = {
  fetchNumberOfSurveysPromise: fetchNumberOfSurveysPromise,
  fetchSurveysByPagePromise: fetchSurveysByPagePromise,
  fetchCountries: fetchCountries,
  fetchPopulations: fetchPopulations,
  fetchLanguages: fetchLanguages,
  fetchSampleMethods: fetchSampleMethods,
  fetchTypeofStudies: fetchTypeofStudies
}
