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

function fetchPollNamesPromise(){
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT DISTINCT Poll_Name FROM Responses", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.Poll_Name));
    });
  });
}

function fetchAllSurveysPromise(){
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Surveys", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows);
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
  fetchPollNamesPromise: fetchPollNamesPromise,
  fetchAllSurveysPromise: fetchAllSurveysPromise
}
