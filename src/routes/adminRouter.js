const express = require("express")
const router = express.Router()
const loader = require("../loader")

//Define our Routes:
const adminRouter = express.Router();
const util = require("util")

// home page route
adminRouter.get('/', function(req, res) {
  res.render("home", {
    active: {
      home: true
    }
  });
})

adminRouter.get('/database/surveys', function(req, res) {
  res.render("admin/database/surveys")
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
