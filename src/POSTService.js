const mysqlConnection = require("./connection")
const util = require("util")
const searchResultsPerPage = 20

function sanitize(myString) {
  var newString = myString.replace("'", "''")
  return newString
}

function insertQuestion(dict) {

  var question = mysqlConnection.escape(dict["question"])
  var survey_id = mysqlConnection.escape(dict["survey_id"])
  var poll_name = mysqlConnection.escape(dict["poll_name"])
  var survey_item_number = mysqlConnection.escape(dict["survey_item_number"])
  var sample_size = mysqlConnection.escape(dict["sample_size"])
  var group = mysqlConnection.escape(dict["group"])
  var theme = mysqlConnection.escape(dict["theme"])
  var created_by = mysqlConnection.escape(dict["created_by"])

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

  console.log("insertQuestionOptions: questionId is "+questionId)

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

      console.log("The current key is: " + key + ", keyword is: " + keyword)

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

  console.log("\n\ncombinedQuery:" + combinedQuery)

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
  insertQuestion: insertQuestion,
  insertQuestionOptions: insertQuestionOptions,
  insertQuestionKeywords: insertQuestionKeywords,
  updateQuestionWithId: updateQuestionWithId,
  updateSurveyWithId: updateSurveyWithId,
  deleteOptionsForQuestionWithId: deleteOptionsForQuestionWithId,
  deleteKeywordsForQuestionWithId: deleteKeywordsForQuestionWithId,
  deleteQuestionWithId: deleteQuestionWithId,
  deleteSurveyWithId: deleteSurveyWithId,
  searchQuestionAndSurvey: searchQuestionAndSurvey,
  searchResultsPerPage: searchResultsPerPage
}
