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

adminRouter.get('/approve/surveys', function(req, res) {
  // loader.fetchPollNamesPromise().then( pollNames => {
  //   res.render("submit/question", {
  //     active: {
  //       submit: true
  //     },
  //     questionInfoModel: questionInfoModel,
  //     surveys: pollNames
  //   })
  // })
  res.render("admin/approve/surveys")
})


adminRouter.get('/approve/questions', function(req, res) {
  // loader.fetchPollNamesPromise().then( pollNames => {
  //   res.render("submit/question", {
  //     active: {
  //       submit: true
  //     },
  //     questionInfoModel: questionInfoModel,
  //     surveys: pollNames
  //   })
  // })
  res.render("admin/approve/questions")
})

adminRouter.get('/manage/surveys', function(req, res) {
  // loader.fetchPollNamesPromise().then( pollNames => {
  //   res.render("submit/question", {
  //     active: {
  //       submit: true
  //     },
  //     questionInfoModel: questionInfoModel,
  //     surveys: pollNames
  //   })
  // })
  res.render("admin/manage/surveys")
})

adminRouter.get('/manage/questions', function(req, res) {
  // loader.fetchPollNamesPromise().then( pollNames => {
  //   res.render("submit/question", {
  //     active: {
  //       submit: true
  //     },
  //     questionInfoModel: questionInfoModel,
  //     surveys: pollNames
  //   })
  // })
  res.render("admin/manage/questions")
})

adminRouter.get('/manage/parameters', function(req, res) {
  // loader.fetchPollNamesPromise().then( pollNames => {
  //   res.render("submit/question", {
  //     active: {
  //       submit: true
  //     },
  //     questionInfoModel: questionInfoModel,
  //     surveys: pollNames
  //   })
  // })
  res.render("admin/manage/parameters")
})

module.exports = adminRouter
