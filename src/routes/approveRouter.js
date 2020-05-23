const express = require("express")
const router = express.Router()
const postService = require("../POSTService")

//Define our Routes:
const approveRouter = express.Router();
const util = require("util")

/** Survey **/
approveRouter.post('/survey/:surveyId', function(req, res) {
  const surveyId = req.params.surveyId
  postService.approveSurveyWithId(surveyId).then(approved => {
    console.log("approved is:"+approved)
    res.send(approved)
  })
})

/** Question **/
approveRouter.post('/question/:questionId', function(req, res) {
  const questionId = req.params.questionId
  postService.approveQuestionWithId(questionId).then(approved => {
    res.send(approved)
  })
})

module.exports = approveRouter
