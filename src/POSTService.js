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

function deleteQuestionWithId(id) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("DELETE FROM Questions WHERE id=" + id, (err, res) => {
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

function searchQuestionAndSurvey(question, survey, page) {
  return new Promise((resolve, reject) => {
    var countQuery, perPageQuestionsQuery

    var rowsOffset = (page - 1) * searchResultsPerPage

    //BOTH Question and Survey filter on
    if (question != "" && survey != "") {
      countQuery = "SELECT COUNT(*) as count FROM Questions WHERE Question LIKE '%" + sanitize(question) + "%' and poll_name LIKE '%" + sanitize(survey) + "%'"
      perPageQuestionsQuery = "SELECT * FROM Questions WHERE Question LIKE '%" + sanitize(question) + "%' and poll_name LIKE '%" + sanitize(survey) + "%'"
    } else if (question != "") { //Filter Questions by Question Only
      countQuery = "SELECT COUNT(*) as count FROM Questions WHERE Question LIKE '%" + sanitize(question) + "%'"
      perPageQuestionsQuery = "SELECT * FROM Questions WHERE Question LIKE '%" + sanitize(question) + "%'"
    } else if (survey != "") { //Filter Questions by Survey Only
      countQuery = "SELECT COUNT(*) as count FROM Questions WHERE poll_name LIKE '%" + sanitize(survey) + "%'"
      perPageQuestionsQuery = "SELECT * FROM Questions WHERE poll_name LIKE '%" + sanitize(survey) + "%'"
    }

    //add limit and offset
    perPageQuestionsQuery += " LIMIT " + searchResultsPerPage + " OFFSET " + rowsOffset

    mysqlConnection.query(countQuery + ";" + perPageQuestionsQuery, (err, res) => {
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
  deleteOptionsForQuestionWithId:deleteOptionsForQuestionWithId,
  deleteKeywordsForQuestionWithId:deleteKeywordsForQuestionWithId,
  deleteQuestionWithId: deleteQuestionWithId,
  deleteSurveyWithId: deleteSurveyWithId,
  searchQuestionAndSurvey: searchQuestionAndSurvey,
  searchResultsPerPage: searchResultsPerPage
}
