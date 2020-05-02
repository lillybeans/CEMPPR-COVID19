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
  loader.fetchNumberOfSurveysPromise().then( records => {
    numberOfRecords = records
    numPages = Math.ceil(numberOfRecords/10)
    for (var i=1; i<= numPages; i++){
      pages.push(i)
    }
    return loader.fetchSurveysByPagePromise(1)
  }).then( rows => {
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
  loader.fetchNumberOfSurveysPromise().then( records => {
    numberOfRecords = records
    numPages = Math.ceil(numberOfRecords/10)
    for (var i=1; i<= numPages; i++){
      pages.push(i)
    }
    return loader.fetchSurveysByPagePromise(page)
  }).then( rows => {
    res.render("admin/database/surveys", {
      surveys: rows,
      surveyModel: surveyModel,
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



module.exports = adminRouter
