const express = require("express")
const router = express.Router()
const getService = require("../GETService")

//Define our Routes:
const pendingRouter = express.Router();
const util = require("util")


/** Database: Questions **/
pendingRouter.get('/questions/:page', function(req, res) {
  const page = req.params.page
  var pages = []
  var numberOfRecords = 0
  var questions = {}

  //Dropdowns
  var groups = []
  var themes = []
  var keywords = []

  getService.fetchNumberOfPendingQuestionsPromise().then(records => {
    numberOfRecords = records
    numPages = Math.ceil(numberOfRecords / getService.perPage)
    for (var i = 1; i <= numPages; i++) {
      pages.push(i)
    }
    return getService.fetchPendingQuestionsByPagePromise(page)
  }).then(questionsMetadata => {
    //console.log("GOT - questionsMetadata: " + util.inspect(questionsMetadata))
    questionsMetadata.map(qMetadata => {
      questions[qMetadata.id] = qMetadata // { 1:{..,"options":__,"keywords":___}}, 2:md2, 3:md3}
    })
    let questionIds = Object.keys(questions)
    var promises = questionIds.map(id => {
      return getService.fetchOptionsAndKeywordsForQuestionWithId(id)
    })
    return Promise.all(promises)
  }).then(questionOptionsAndKeywords => {
    //questionOptionsAndKeywords is an ARRAY
    //[firstQuestion, secondQuestion, thirdQuestion]
    //firstQuestion:[options, keywords], secondQuestion:[options,keywords]

    for (var q = 0; q < questionOptionsAndKeywords.length; q++) {
      var question = questionOptionsAndKeywords[q]
      var questionOptions = question[0]
      var questionKeywords = question[1]
      var questionId = questionOptions[0].question_id

      questions[questionId]["options"] = questionOptions.map(row => {
        return {
          "id": row.id,
          "option": row.option,
          "percentage": row.percentage
        }
      })

      questions[questionId]["keywords"] = questionKeywords.map(row => {
        return {
        "id": row.id,
        "keyword": row.keyword
        }
      })
    }

    return getService.fetchGroups()
  }).then(groupsRes => {
    groups = groupsRes
    return getService.fetchThemes()
  }).then(themesRes => {
    themes = themesRes
    return getService.fetchKeywords()
  }).then(keywordsRes => {
    keywords = keywordsRes

    res.render("pending/questions", {
      numberOfRecords: numberOfRecords,
      pages: pages,
      active: page,
      questions: questions,
      groups: groups,
      themes: themes,
      keywords: keywords
    })
  })

})

module.exports = pendingRouter
