const express = require("express")
const router = express.Router()
const getService = require("../GETService")

//Define our Routes:
const pendingRouter = express.Router();
const util = require("util")


pendingRouter.get('/surveys', function(req, res) {
  // getService.fetchPollNamesPromise().then( pollNames => {
  //   res.render("submit/question", {
  //     active: {
  //       submit: true
  //     },
  //     questionInfoModel: questionInfoModel,
  //     surveys: pollNames
  //   })
  // })
  res.render("pending/surveys")
})

pendingRouter.get('/questions', function(req, res) {
  // getService.fetchPollNamesPromise().then( pollNames => {
  //   res.render("submit/question", {
  //     active: {
  //       submit: true
  //     },
  //     questionInfoModel: questionInfoModel,
  //     surveys: pollNames
  //   })
  // })
  res.render("pending/questions")
})

module.exports = pendingRouter
