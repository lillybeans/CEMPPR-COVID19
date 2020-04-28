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
  let pollNames, groups, themes, keywords
  return queryPromise("SELECT DISTINCT Poll_Name FROM Responses").then(rows => {
      pollNames = rows.map(row => row.Poll_Name)
      return PollNames
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
  fetchPollNamesPromise: fetchPollNamesPromise
}
