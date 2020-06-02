const mysqlConnection = require("./connection")
const bcrypt = require("bcrypt")
const util = require("util")
const searchResultsPerPage = 20

function sanitize(myString) {
  var newString = myString.replace("'", "''")
  return newString
}

function insertQuestion(dict, userId) {

  var question = mysqlConnection.escape(dict["question"])
  var survey_id = mysqlConnection.escape(dict["survey_id"])
  var poll_name = mysqlConnection.escape(dict["poll_name"])
  var survey_item_number = mysqlConnection.escape(dict["survey_item_number"])
  var sample_size = mysqlConnection.escape(dict["sample_size"])
  var group = mysqlConnection.escape(dict["group"])
  var theme = mysqlConnection.escape(dict["theme"])
  var created_by = mysqlConnection.escape(userId)

  var insertQuestionQuery = "INSERT INTO Questions (question, survey_id, poll_name, survey_item_number, sample_size, `group`, theme, created_by) \
                             VALUES (" + question + "," + survey_id + "," + poll_name + "," + survey_item_number + "," + sample_size + "," + group + "," + theme + "," + created_by + ")"

  return new Promise((resolve, reject) => {
    mysqlConnection.query(insertQuestionQuery, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res.insertId);
    })
  })
}

function insertQuestionOptions(questionId, dict) {

  var insertOptionQueries = []

  var keys = Object.keys(dict);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (key.includes("option")) {
      var option = mysqlConnection.escape(dict[key])
      var percentage = dict[keys[i + 1]]
      insertOptionQueries.push("INSERT INTO Question_Options (question_id, `option`, percentage) VALUES (" + questionId + "," + option + "," + percentage + ")")
      i += 1 // skip percentage
    }
  }

  var insertOptionsQueryString = insertOptionQueries.join(";")

  return new Promise((resolve, reject) => {
    mysqlConnection.query(insertOptionsQueryString, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res);
    })
  })
}

function insertQuestionKeywords(questionId, dict) {

  var insertKeywordQueries = []

  var keys = Object.keys(dict);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (key.includes("keyword")) {
      var keyword = mysqlConnection.escape(dict[key])
      console.log("keyword is:" + keyword)
      insertKeywordQueries.push("INSERT INTO Question_Keywords (question_id, keyword) VALUES (" + questionId + "," + keyword + ")")
    }
  }

  var insertKeywordsQueryString = insertKeywordQueries.join(";")

  return new Promise((resolve, reject) => {
    mysqlConnection.query(insertKeywordsQueryString, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res);
    })
  })
}


function updateQuestionWithId(id, dict) {
  var fieldsToUpdate = ""
  var keys = Object.keys(dict);

  //We don't need to keep track of original
  var optionQueries = []
  var keywordQueries = []

  //Find inserted, deleted and updated questions and percentages
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    //If this is a question option
    if (key.includes("option")) { //possibilities: option_updated_159, percentage_deleted_161, option_original_163, option_inserted
      var optionArray = key.split("_") //[option or percentage, state, ID]
      var optionState = optionArray[1] //possibilities: updated, deleted, original, inserted

      switch (optionState) {
        case "original":
          break
        case "updated":
          var updatedOptionId = optionArray[2]
          var updatedOption = mysqlConnection.escape(dict[key])
          var updatedOptionPercentage = dict[keys[i + 1]] //should be in order

          let updateQuery = "UPDATE Question_Options SET `option` = " + updatedOption + ", percentage = " + updatedOptionPercentage + " WHERE id=" + updatedOptionId
          optionQueries.push(updateQuery)
          break
        case "deleted":
          var deletedOptionId = optionArray[2]

          let deleteQuery = "DELETE FROM Question_Options WHERE id=" + deletedOptionId
          optionQueries.push(deleteQuery)
          break
        case "inserted":
          var insertedOption = mysqlConnection.escape(dict[key])
          var insertedOptionPercentage = dict[keys[i + 1]]

          let insertQuery = "INSERT INTO Question_Options (question_id, `option`, percentage) VALUES (" + id + ", " + insertedOption + ", " + insertedOptionPercentage + ")"
          optionQueries.push(insertQuery)
          break
      }

      i = i + 1 //skip next key cause its gonna be percentage
    } else if (key.includes("keyword")) {
      var keywordArray = key.split("_")
      var keywordState = keywordArray[1]
      var keyword = mysqlConnection.escape(dict[key])

      switch (keywordState) {
        case "inserted":
          let insertQuery = "INSERT INTO Question_Keywords (question_id, keyword) VALUES (" + id + ", " + keyword + ")"
          keywordQueries.push(insertQuery)
          break
        case "deleted":
          let deleteQuery = "DELETE FROM Question_Keywords WHERE question_id=" + id + " AND keyword=" + keyword
          keywordQueries.push(deleteQuery)
          break
        default:
          break
      }
    } else { //general metadata
      //if not first key value pair, add comma and line break before
      if (fieldsToUpdate != "") {
        fieldsToUpdate += ",\n"
      }

      fieldsToUpdate = fieldsToUpdate + "`" + key + "`" + "=" + mysqlConnection.escape(dict[key])
    }

  }

  //general metadata
  updateQuestionQuery = "UPDATE Questions SET \n" +
    fieldsToUpdate + "\n" +
    "WHERE id =" + id

  //options

  var optionsQueryString = optionQueries.join(";")

  //keywords
  var keywordsQueryString = keywordQueries.join(";")

  var combinedQuery = updateQuestionQuery + ";"

  if (optionsQueryString != "") {
    combinedQuery += optionsQueryString + ";"
  }

  if (keywordsQueryString != "") {
    combinedQuery += keywordsQueryString
  }

  return new Promise((resolve, reject) => {
    mysqlConnection.query(combinedQuery, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res);
    });
  });

}

/** Surveys **/


function insertSurvey(dict) {

  var polling_group = mysqlConnection.escape(dict["polling_group"])
  var poll_name = mysqlConnection.escape(dict["poll_name"])
  var country = mysqlConnection.escape(dict["country"])
  var subnational = mysqlConnection.escape(dict["subnational"])
  var population = mysqlConnection.escape(dict["population"])
  var language = mysqlConnection.escape(dict["language"])
  var sample_size = mysqlConnection.escape(dict["sample_size"])
  var sample_method = mysqlConnection.escape(dict["sample_method"])
  var type_of_study = mysqlConnection.escape(dict["type_of_study"])
  var url = mysqlConnection.escape(dict["url"])
  var publication_date = mysqlConnection.escape(dict["publication_date"])
  var start_date = mysqlConnection.escape(dict["start_date"])
  var end_date = mysqlConnection.escape(dict["end_date"])
  var created_by = mysqlConnection.escape(dict["created_by"])


  var insertSurveyQuery = "INSERT INTO Surveys (polling_group, poll_name, country, subnational, population, `language`, sample_size, sample_method, type_of_study, url, publication_date, start_date, end_date, created_by) \
                             VALUES (" + polling_group + "," + poll_name + "," + country + "," + subnational + "," + population + "," + language + "," + sample_size + "," + sample_method + "," + type_of_study + "," + url + "," + publication_date + "," + start_date + "," + end_date + "," + created_by + ")"

  return new Promise((resolve, reject) => {
    mysqlConnection.query(insertSurveyQuery, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res.insertId);
    })
  })
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

  updateSurveyQuery = "UPDATE Surveys SET \n" +
    fieldsToUpdate + "\n" +
    "WHERE id =" + id

  return new Promise((resolve, reject) => {
    mysqlConnection.query(updateSurveyQuery, (err, row) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(row);
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

function searchQuestionAndSurvey(question, survey, status, page) {
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

    if (status == "approved") {
      countQuery = countQuery + " AND approved = true"
      perPageQuestionsQuery = perPageQuestionsQuery + " AND approved = true"
    } else if (status == "pending") {
      countQuery = countQuery + " AND approved = false"
      perPageQuestionsQuery = perPageQuestionsQuery + " AND approved = false"
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

/** Approve **/

function approveSurveyWithId(surveyId) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("UPDATE Surveys SET approved = true WHERE id=" + surveyId, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res);
    });
  });
}


function approveQuestionWithId(questionId) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("UPDATE Questions SET approved = true WHERE id=" + questionId, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" + err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

/** User **/

function createUser(form) {
  return new Promise((resolve, reject) => {

    var email = mysqlConnection.escape(form["email"])
    var unescapedPassword = form["password"]
    var first_name = mysqlConnection.escape(form["first_name"])
    var last_name = mysqlConnection.escape(form["last_name"])
    var how_did_you_hear_about_us = mysqlConnection.escape(form["how_did_you_hear_about_us"])
    var why_get_involved = mysqlConnection.escape(form["why_get_involved"])
    var language_proficiencies = mysqlConnection.escape(form["language_proficiencies"])
    var education = mysqlConnection.escape(form["education"])

    let hashedPassword = bcrypt.hashSync(unescapedPassword, 10)
    let escapedHashPassword = mysqlConnection.escape(hashedPassword)

    mysqlConnection.query("INSERT INTO Users (email, password, first_name, last_name, how_did_you_hear_about_us, why_get_involved, language_proficiencies, education) VALUES (" + email + "," + escapedHashPassword + "," + first_name + "," + last_name + "," + how_did_you_hear_about_us + "," + why_get_involved + "," + language_proficiencies + "," + education + ")", (err, res) => {
      if (err) {
        return reject(err.sqlMessage);
      }
      resolve(res);
    });
  });
}

function approveUsers(dict){
  var ids = Object.keys(dict);
  var idsString = ids.join(",")

  return new Promise((resolve, reject) => {
    mysqlConnection.query("UPDATE Users SET approved = true WHERE id in ("+ idsString +")", (err, res) => {
      if (err) {
        return reject(err.sqlMessage)
      }
      resolve(res)
    })
  })
}

function deleteUsers(ids){
  var idsString = ids.join(",")

  return new Promise((resolve, reject) => {
    mysqlConnection.query("DELETE FROM Users WHERE id in ("+ idsString +")", (err, res) => {
      if (err) {
        return reject(err.sqlMessage)
      }
      resolve(res)
    })
  })
}

module.exports = {
  insertQuestion: insertQuestion,
  insertQuestionOptions: insertQuestionOptions,
  insertQuestionKeywords: insertQuestionKeywords,
  insertSurvey: insertSurvey,
  updateQuestionWithId: updateQuestionWithId,
  updateSurveyWithId: updateSurveyWithId,
  deleteQuestionWithId: deleteQuestionWithId,
  deleteSurveyWithId: deleteSurveyWithId,
  searchQuestionAndSurvey: searchQuestionAndSurvey,
  searchResultsPerPage: searchResultsPerPage,
  approveSurveyWithId: approveSurveyWithId,
  approveQuestionWithId: approveQuestionWithId,
  createUser: createUser,
  approveUsers: approveUsers,
  deleteUsers: deleteUsers
}
