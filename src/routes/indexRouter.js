const express = require("express")
const router = express.Router()
const loader = require("../loader")

const questionInfoModel = require("../models/questionInfoModel")

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
  loader.fetchSurveys(surveys => {
    res.render("submit/question", {
      active: {
        submit: true
      },
      questionInfoModel: questionInfoModel,
      surveys: surveys
    })
  })

})

indexRouter.get('/submit/survey', function(req, res) {
  res.render("submit/survey", {
    active: {
      submit: true
    }
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
