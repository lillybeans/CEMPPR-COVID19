const express = require("express")
const router = express.Router()
const getService = require("../GETService")

const submitSurveyModel = require("../models/submitSurveyModel")

//Define our Routes:
const submitRouter = express.Router();
const util = require("util")

// home page route

submitRouter.get('/question', function(req, res) {
  var surveys = []

  //Dropdowns
  var groups = []
  var themes = []
  var keywords = []

  getService.fetchSurveysByPagePromise(1).then(surveysRes => {
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
      keywords: keywords
    })
  })

})

submitRouter.get('/survey', function(req, res) {
  res.render("submit/survey", {
    active: {
      submit: true
    },
    surveyModel: submitSurveyModel
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
