const express = require("express")
const router = express.Router()
const getService = require("../GETService")

//Define our Routes:
const adminRouter = express.Router();
const util = require("util")

const editSurveyModel = require("../models/editSurveyModel")

// home page route
adminRouter.get('/', function(req, res) {
  res.render("home", {
    active: {
      home: true
    }
  });
})

/** Database: Surveys **/
adminRouter.get('/database/surveys/:page', function(req, res) {
  const page = req.params.page
  var pages = []
  var numberOfRecords = 0

  //Dropdowns
  var countries = []
  var populations = []
  var languages = []
  var sampleMethods = []
  var typeOfStudies = []

  getService.fetchNumberOfSurveysPromise().then(records => {
    numberOfRecords = records
    numPages = Math.ceil(numberOfRecords / 10)
    for (var i = 1; i <= numPages; i++) {
      pages.push(i)
    }
    return getService.fetchCountries()
  }).then(countriesRes => {
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
    return getService.fetchSurveysByPagePromise(page)
  }).then( rows => {
    var populatedModel = populateModelWithData(editSurveyModel, countries, populations, languages, sampleMethods, typeOfStudies)
    res.render("admin/database/surveys", {
      surveys: rows,
      numberOfRecords: numberOfRecords,
      surveyModel: populatedModel,
      pages: pages,
      active: page
    })
  })
})

adminRouter.get('/database/surveys/:surveyId/questions/:page', function(req, res) {
  const surveyId = req.params.surveyId
  const page = req.params.page
  var surveyName = ""
  var questions = {}
  getService.fetchSurveyWithId(surveyId).then(survey => {
    surveyName = survey.poll_name
    return getService.fetchQuestionsForSurveyWithId(surveyId, page)
  }).then(questionMetadata => {
    questionMetadata.map(q => {
      questions[q.id] = questionMetadata // { 1:md1, 2:md2, 3:md3}
    })
    var promises = questions.map((question) => {
      return fetchOptionsAndKeywordsForQuestionWithId(question.id)
    })
    return Promise.all(promises)
  }).then(questionOptionsAndKeywords => {
    var optionsResults = questionOptionsAndKeywords[0]
    var keywordsResults = questionOptionsAndKeywords[1]
    var questionId = optionsResults.question
    questions[questionId]["options"] = optionsResults.map(res => { return {"option": res.option, "percentage": res.percentage}})
    questions[questionId]["keywords"] = keywordsResults.map(res => res.keyword)
    res.render("admin/database/survey_questions",{
      surveyName: surveyName,
      questions: questions
    })
  })
})

adminRouter.get('/database/questions', function(req, res) {
  res.render("admin/database/questions")
})

adminRouter.get('/database/parameters', function(req, res) {
  res.render("admin/database/parameters")
})

adminRouter.get('/pending/surveys', function(req, res) {
  // getService.fetchPollNamesPromise().then( pollNames => {
  //   res.render("submit/question", {
  //     active: {
  //       submit: true
  //     },
  //     questionInfoModel: questionInfoModel,
  //     surveys: pollNames
  //   })
  // })
  res.render("admin/pending/surveys")
})

adminRouter.get('/pending/questions', function(req, res) {
  // getService.fetchPollNamesPromise().then( pollNames => {
  //   res.render("submit/question", {
  //     active: {
  //       submit: true
  //     },
  //     questionInfoModel: questionInfoModel,
  //     surveys: pollNames
  //   })
  // })
  res.render("admin/pending/questions")
})

function populateModelWithData(surveyModel, countries, populations, languages, sampleMethods, typeOfStudies) {
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
  return {"formItems": formItems}
}


module.exports = adminRouter
