const express = require("express")
const router = express.Router()
const postService = require("../POSTService")

//Define our Routes:
const updateRouter = express.Router();
const util = require("util")

const editSurveyModel = require("../models/editSurveyModel")

//Will send back a timestamp for updated at
updateRouter.post('/survey/:surveyId', function(req, res) {
  const surveyId = req.params.surveyId
  const formData = req.body
  postService.updateSurveyWithId(surveyId, formData).then(updateResult => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var timeStamp = yyyy+"-"+mm+"-"+dd
    res.send(timeStamp)
  })
})

module.exports = updateRouter
