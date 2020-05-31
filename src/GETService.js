const mysqlConnection = require("./connection")
const util = require("util")

const perPage = 20;

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

function fetchPollNamesPromise() {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT poll_name FROM Surveys WHERE approved = true ORDER BY id DESC LIMIT " + perPage, (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.poll_name));
    });
  });
}

function fetchSurveyWithId(surveyId) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Surveys WHERE id=" + surveyId, (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows[0]);
    });
  });
}

function fetchNumberOfSurveysPromise(type) {
  return new Promise((resolve, reject) => {

    var typeFilter = ""
    switch (type) {
      case "all":
        typeFilter = ""
        break
      case "approved":
        typeFilter = " WHERE approved = true"
        break
      case "pending":
        typeFilter = " WHERE approved = false"
        break
    }

    mysqlConnection.query("SELECT COUNT(*) AS count FROM Surveys" + typeFilter, (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows[0].count);
    });
  });
}

function fetchSurveysByPagePromise(page, type) {
  var rowsOffset = (page - 1) * perPage
  return new Promise((resolve, reject) => {

    var typeFilter = ""
    switch (type) {
      case "all":
        typeFilter = ""
        break
      case "approved":
        typeFilter = " WHERE approved = true"
        break
      case "pending":
        typeFilter = " WHERE approved = false"
        break
    }

    let query = "SELECT * FROM Surveys" + typeFilter + " ORDER BY created_at DESC LIMIT "+ perPage +" OFFSET " + rowsOffset

    mysqlConnection.query(query, (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows);
    });
  });
}

/** Questions **/

function fetchNumberOfQuestionsPromise(type) {
  return new Promise((resolve, reject) => {
    var typeFilter = ""
    switch (type) {
      case "all":
        typeFilter = ""
        break
      case "approved":
        typeFilter = " WHERE approved = true"
        break
      case "pending":
        typeFilter = " WHERE approved = false"
        break
    }
    mysqlConnection.query("SELECT COUNT(*) AS count FROM Questions" + typeFilter, (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows[0].count);
    });
  });
}

function fetchQuestionsByPagePromise(page, type) {
  var rowsOffset = (page - 1) * perPage
  return new Promise((resolve, reject) => {
    var typeFilter = ""
    switch (type) {
      case "all":
        typeFilter = ""
        break
      case "approved":
        typeFilter = " WHERE approved = true"
        break
      case "pending":
        typeFilter = " WHERE approved = false"
        break
    }
    mysqlConnection.query("SELECT * FROM Questions" + typeFilter + " ORDER BY created_at ASC LIMIT " + perPage + " OFFSET " + rowsOffset, (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows);
    });
  });
}

function fetchQuestionsForSurveyWithId(surveyId, page) {
  var rowsOffset = (page - 1) * perPage
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Questions WHERE survey_id=" + surveyId + " AND approved = true LIMIT 10 OFFSET " + rowsOffset, (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows);
    });
  });
}

function fetchOptionsAndKeywordsForQuestionWithId(questionId) {
  var optionsQuery = "SELECT * FROM Question_Options WHERE question_id=" + questionId
  var keywordsQuery = "SELECT * FROM Question_Keywords WHERE question_id=" + questionId
  return new Promise((resolve, reject) => {
    mysqlConnection.query(optionsQuery + ";" + keywordsQuery, (err, results) => {
      if (err)
        return reject(err);
      //console.log("\n\n\n" + questionId + ":fetchOptionsAndKeywordsForQuestionWithId results[0]:"+util.inspect(results[0]))
      //console.log("\n" + questionId + ":fetchOptionsAndKeywordsForQuestionWithId results[1][0].keyword:"+util.inspect(results[1][0].keyword))
      resolve(results);
    });
  });
}


/** Survey Parameters **/

function fetchCountries() {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Countries", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.name));
    });
  });
}

function fetchPopulations() {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Population", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.name));
    });
  });
}

function fetchLanguages() {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Language", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.name));
    });
  });
}

function fetchSampleMethods() {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM SampleMethods", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.name));
    });
  });
}

function fetchTypeofStudies() {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM TypeOfStudy", (err, rows) => {
      if (err)
        return reject(err);
      resolve(rows.map(row => row.name));
    });
  });
}

/** Question Parameters **/

function fetchGroups(withDescription = false) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM `Groups`", (err, rows) => {
      if (err)
        return reject(err);
      if (withDescription) {
        resolve(rows)
      } else {
        resolve(rows.map(row => row.name));
      }
    });
  });
}

function fetchThemes(withDescription = false) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Themes", (err, rows) => {
      if (err)
        return reject(err);
      if (withDescription) {
        resolve(rows)
      } else {
        resolve(rows.map(row => row.name));
      }
    });
  });
}

function fetchKeywords(withDescription = false) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Keywords", (err, rows) => {
      if (err)
        return reject(err);
      if (withDescription) {
        resolve(rows)
      } else {
        resolve(rows.map(row => row.name));
      }
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

// USERS

function getUsers(state){
  var query = "SELECT * FROM Users"

  switch (state){
    case "approved":
      query += " WHERE approved = true"
      break
    case "pending":
      query += " WHERE approved = false"
      break
    case "all":
      break
  }

  return new Promise((resolve, reject) => {
    mysqlConnection.query(query, (err, rows) => {
      if (err)
        return reject(err)
      resolve(rows)
    })
  })
}

module.exports = {
  perPage: perPage,
  fetchSurveyWithId: fetchSurveyWithId,
  fetchPollNamesPromise: fetchPollNamesPromise,
  fetchNumberOfSurveysPromise: fetchNumberOfSurveysPromise,
  fetchSurveysByPagePromise: fetchSurveysByPagePromise,
  fetchNumberOfQuestionsPromise: fetchNumberOfQuestionsPromise,
  fetchQuestionsByPagePromise: fetchQuestionsByPagePromise,
  fetchCountries: fetchCountries,
  fetchPopulations: fetchPopulations,
  fetchLanguages: fetchLanguages,
  fetchSampleMethods: fetchSampleMethods,
  fetchTypeofStudies: fetchTypeofStudies,
  fetchGroups: fetchGroups,
  fetchThemes: fetchThemes,
  fetchKeywords: fetchKeywords,
  fetchQuestionsForSurveyWithId: fetchQuestionsForSurveyWithId,
  fetchOptionsAndKeywordsForQuestionWithId: fetchOptionsAndKeywordsForQuestionWithId,
  getUsers: getUsers
}
