const express = require("express")
const router = express.Router()
const getService = require("../GETService")
const postService = require("../POSTService")

const submitSurveyModel = require("../models/submitSurveyModel")

//Define our Routes:
const submitRouter = express.Router();
const util = require("util")

// home page route

submitRouter.get('/question/:status?', function(req, res) {
  const status = req.params.status //optional, either "submitted" or nothing

  var isSubmitted = false
  if (status == "submitted"){
    isSubmitted = true
  }

  var surveys = []

  //Dropdowns
  var groups = []
  var themes = []
  var keywords = []

  getService.fetchSurveysByPagePromise(1, "all").then(surveysRes => {
    surveys = surveysRes //only first 20
    return getService.fetchGroups()
  }).then(groupsRes => {
    groups = groupsRes
    return getService.fetchThemes()
  }).then(themesRes => {
    themes = themesRes
    return getService.fetchKeywords()
  }).then(keywordsRes => {
    keywords = keywordsRes

    res.render("submit/question", {
      surveys: surveys,
      groups: groups,
      themes: themes,
      keywords: keywords,
      submitted: isSubmitted
    })
  })

})

submitRouter.post('/question', function(req, res){

  const formData = req.body
  var questionId = ""

  postService.insertQuestion(formData).then(newInsertQuestionId => {
    questionId = newInsertQuestionId
    return postService.insertQuestionOptions(questionId, formData)
  }).then(insertQuestionOptionsRes => {
    return postService.insertQuestionKeywords(questionId, formData)
  }).then(insertQuestionKeywordsRes => {
    res.send("success")
  })
})

submitRouter.get('/survey/:status?', function(req, res) {

  const status = req.params.status //optional, either "submitted" or nothing

  var isSubmitted = false
  if (status == "submitted"){
    isSubmitted = true
  }

  //Dropdowns
  var countries = []
  var populations = []
  var languages = []
  var sampleMethods = []
  var typeOfStudies = []

  getService.fetchCountries()
    .then(countriesRes => {
      countries = countriesRes
      return getService.fetchPopulations()
    }).then(populationsRes => {
      populations = populationsRes
      return getService.fetchLanguages()
    }).then(languagesRes => {
      languages = languagesRes
      return getService.fetchSampleMethods()
    }).then(sampleMethodsRes => {
      sampleMethods = sampleMethodsRes
      return getService.fetchTypeofStudies()
    }).then(typeOfStudiesRes => {
      typeOfStudies = typeOfStudiesRes

      var populatedModel = populateSurveyModelWithData(submitSurveyModel, countries, populations, languages, sampleMethods, typeOfStudies)
      res.render("submit/survey", {
        surveyModel: populatedModel,
        submitted: isSubmitted
      })
    })
})

submitRouter.post('/survey', function(req, res){

  const formData = req.body

  postService.insertSurvey(formData).then(newInsertSurveyId => {
    res.send("success")
  })
})

function populateSurveyModelWithData(surveyModel, countries, populations, languages, sampleMethods, typeOfStudies) {
  var formItems = surveyModel.formItems
  for (var i = 0; i < formItems.length; i++) {
    var item = formItems[i]
    switch (item.name) {
      case "country":
        item.options = countries
        break;
      case "population":
        item.options = populations
        break;
      case "language":
        item.options = languages
        break;
      case "sample_method":
        item.options = sampleMethods
        break;
      case "type_of_study":
        item.options = typeOfStudies
        break;
      default:
        break;
    }
  }
  return {
    "formItems": formItems
  }
}

module.exports = submitRouter
