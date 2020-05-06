const mysqlConnection = require("./connection")

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
        console.log("MYSQL Error:" +  err)
        return reject(err);
      }
      resolve(row);
    });
  });
}

function deleteOptionsForQuestionWithId(id) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("DELETE FROM Question_Options WHERE question_id="+id, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" +  err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

function deleteKeywordsForQuestionWithId(id) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("DELETE FROM Question_Keywords WHERE question_id="+id, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" +  err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

function deleteQuestionsForSurveyWithId(id) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("DELETE FROM Questions WHERE survey_id="+id, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" +  err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

function deleteSurveyWithId(id) {
  return new Promise((resolve, reject) => {
    mysqlConnection.query("DELETE FROM Surveys WHERE id="+id, (err, res) => {
      if (err) {
        console.log("MYSQL Error:" +  err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

function searchQuestion(text){
  return new Promise((resolve, reject) => {
    mysqlConnection.query("SELECT * FROM Questions WHERE Question LIKE '%"+ mysqlConnection.escape(text) + "%'", (err, res) => {
      if (err) {
        console.log("MYSQL Error:" +  err)
        return reject(err);
      }
      resolve(res);
    });
  });
}

module.exports = {
  updateSurveyWithId: updateSurveyWithId,
  deleteQuestionsForSurveyWithId:deleteQuestionsForSurveyWithId,
  deleteSurveyWithId: deleteSurveyWithId,
  searchQuestion: searchQuestion
}
