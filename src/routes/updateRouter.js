const express = require("express")
const router = express.Router()
const postService = require("../POSTService")
const authService = require("../auth")

//Define our Routes:
const updateRouter = express.Router();
const util = require("util")

//Will send back a timestamp for updated at
updateRouter.post('/question/:questionId', function(req, res) {
  const questionId = req.params.questionId
  const formData = req.body
  const userId = req.user.id

  postService.updateQuestionWithId(questionId, formData, userId).then(updateResult => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var timeStamp = yyyy+"-"+mm+"-"+dd
    res.send(timeStamp)
  })
})

updateRouter.post('/survey/:surveyId', function(req, res) {
  const surveyId = req.params.surveyId
  const formData = req.body
  const userId = req.user.id

  postService.updateSurveyWithId(surveyId, formData, userId).then(updateResult => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var timeStamp = yyyy+"-"+mm+"-"+dd
    res.send(timeStamp)
  })
})

module.exports = updateRouter
