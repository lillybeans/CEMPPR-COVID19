const mysqlConnection = require("./connection")
const util = require("util")
const searchResultsPerPage = 20

function sanitize(myString) {
  var newString = myString.replace("'", "''")
  return newString
}

function updateSurveyWithId(id, dict) {
  var fieldsToUpdate = ""
  var keys = Object.keys(dict);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    fieldsToUpdate = fieldsToUpdate + key + "=" + mysqlConnection.escape(dict[key])
    if (i < keys.length - 1) {
      fieldsToUpdate = fieldsToUpdate + ",\n"
    }
  }

  query = "UPDATE Surveys SET \n" +
    fieldsToUpdate + "\n" +
    "WHERE id =" + id

  return new Promise((resolve, reject) => {
    mysqlConnection.query(query, (err, row) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(row);
    });
  });
}

function deleteOptionsForQuestionWithId(id) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("DELETE FROM Question_Options WHERE question_id=" + id, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

function deleteKeywordsForQuestionWithId(id) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("DELETE FROM Question_Keywords WHERE question_id=" + id, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

function deleteQuestionsForSurveyWithId(id) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("DELETE FROM Questions WHERE survey_id=" + id, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

function deleteSurveyWithId(id) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("DELETE FROM Surveys WHERE id=" + id, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

function searchQuestionAndSurvey(question, survey) {
  return new Promise((resolve, reject) => {
    var countQuery, firstPageQuestionQuery

    //BOTH Question and Survey filter on
    if (question != "" && survey != "") {
      countQuery = "SELECT COUNT(*) as count FROM Questions WHERE Question LIKE '%" + sanitize(question) + "%' and poll_name LIKE '%" + sanitize(survey) + "%'"
      firstPageQuestionsQuery = "SELECT * FROM Questions WHERE Question LIKE '%" + sanitize(question) + "%' and poll_name LIKE '%" + sanitize(survey) + "%' LIMIT " + searchResultsPerPage
    } else if (question != "") { //Filter Questions by Question Only
      countQuery = "SELECT COUNT(*) as count FROM Questions WHERE Question LIKE '%" + sanitize(question) + "%'"
      firstPageQuestionsQuery = "SELECT * FROM Questions WHERE Question LIKE '%" + sanitize(question) + "%' LIMIT " + searchResultsPerPage
    } else if (survey != "") { //Filter Questions by Survey Only
      countQuery = "SELECT COUNT(*) as count FROM Questions WHERE poll_name LIKE '%" + sanitize(survey) + "%'"
      firstPageQuestionsQuery = "SELECT * FROM Questions WHERE poll_name LIKE '%" + sanitize(survey) + "%' LIMIT " + searchResultsPerPage
    }

    mysqlConnection.query(countQuery + ";" + firstPageQuestionsQuery, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

module.exports = {
  updateSurveyWithId: updateSurveyWithId,
  deleteQuestionsForSurveyWithId: deleteQuestionsForSurveyWithId,
  deleteSurveyWithId: deleteSurveyWithId,
  searchQuestionAndSurvey: searchQuestionAndSurvey,
  searchResultsPerPage: searchResultsPerPage
}
