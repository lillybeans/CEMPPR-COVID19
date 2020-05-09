const express = require("express")
const router = express.Router()
const postService = require("../POSTService")

//Define our Routes:
const deleteRouter = express.Router();
const util = require("util")

//Will send back a timestamp for updated at
deleteRouter.post('/survey/:surveyId', function(req, res) {
  const surveyId = req.params.surveyId
  postService.deleteSurveyWithId(surveyId).then(deleteResult => {
    res.send(deleteResult)
  })
})

deleteRouter.post('/question/:questionId', function(req, res) {
  const questionId = req.params.questionId
  postService.deleteOptionsForQuestionWithId(questionId)
  }).then( deleteResult => {
    return postService.deleteKeywordsForQuestionWithId(questionId)
  }).then(deleteResult => {
    return postService.deleteQuestionWithId(questionId)
  }).then(deleteResult => {
    res.send(deleteResult)
  })
})


module.exports = deleteRouter
