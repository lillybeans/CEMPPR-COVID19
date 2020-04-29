const express = require("express")
const router = express.Router()
const loader = require("../loader")

const questionInfoModel = require("../models/questionInfoModel")
const submitSurveyModel = require("../models/submitSurveyModel")

//Define our Routes:
const indexRouter = express.Router();
const util = require("util")

// home page route
indexRouter.get('/', function(req, res) {
  res.render("home", {
    active: {
      home: true
    }
  });
})

indexRouter.get('/submit/question', function(req, res) {
  loader.fetchPollNamesPromise().then( pollNames => {
    res.render("submit/question", {
      active: {
        submit: true
      },
      questionInfoModel: questionInfoModel,
      surveys: pollNames
    })
  })
})

indexRouter.get('/submit/survey', function(req, res) {
  res.render("submit/survey", {
    active: {
      submit: true
    },
    submitSurveyModel: submitSurveyModel
  })
})

indexRouter.get('/about', function(req, res) {
  res.render("about", {
    active: {
      about: true
    }
  })
})

module.exports = indexRouter
