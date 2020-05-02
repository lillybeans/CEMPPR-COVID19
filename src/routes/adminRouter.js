const express = require("express")
const router = express.Router()
const loader = require("../loader")

//Define our Routes:
const adminRouter = express.Router();
const util = require("util")

const surveyModel = require("../models/surveyModel")

// home page route
adminRouter.get('/', function(req, res) {
  res.render("home", {
    active: {
      home: true
    }
  });
})

/** Database: Surveys **/
adminRouter.get('/database/surveys', function(req, res) {
  var pages = []
  var numberOfRecords = 0
  loader.fetchNumberOfSurveysPromise().then(records => {
    numberOfRecords = records
    numPages = Math.ceil(numberOfRecords / 10)
    for (var i = 1; i <= numPages; i++) {
      pages.push(i)
    }
    return loader.fetchSurveysByPagePromise(1)
  }).then(rows => {
    res.render("admin/database/surveys", {
      surveys: rows,
      surveyModel: surveyModel,
      pages: pages,
      active: 1
    })
  })
})

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

  loader.fetchNumberOfSurveysPromise().then(records => {
    numberOfRecords = records
    numPages = Math.ceil(numberOfRecords / 10)
    for (var i = 1; i <= numPages; i++) {
      pages.push(i)
    }
    return loader.fetchCountries()
  }).then(countriesRes => {
    countries = countriesRes
    return loader.fetchPopulations()
  }).then(populationsRes => {
    populations = populationsRes
    return loader.fetchLanguages()
  }).then(languagesRes => {
    languages = languagesRes
    return loader.fetchSampleMethods()
  }).then(sampleMethodsRes => {
    sampleMethods = sampleMethodsRes
    return loader.fetchTypeofStudies()
  }).then(typeOfStudiesRes => {
    typeOfStudies = typeOfStudiesRes
    return loader.fetchSurveysByPagePromise(page)
  }).then( rows => {
    var populatedModel = populateModelWithData(surveyModel, countries, populations, languages, sampleMethods, typeOfStudies)
    console.log("populated model is: "+util.inspect(populatedModel))
    res.render("admin/database/surveys", {
      surveys: rows,
      surveyModel: populatedModel,
      pages: pages,
      active: page
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
  // loader.fetchPollNamesPromise().then( pollNames => {
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
  // loader.fetchPollNamesPromise().then( pollNames => {
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
