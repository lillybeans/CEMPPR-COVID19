const express = require("express")
const router = express.Router()
const getService = require("../GETService")
const postService = require("../POSTService")
const passport = require('passport')
const authService = require("../auth")

//Define our Routes:
const authRouter = express.Router();
const util = require("util")

authRouter.get('/login', authService.checkNotAuthenticated, function(req, res) {
  res.render("login", {
    active: {
      login: true
    }
  })
})

authRouter.post('/login', authService.checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function(req, res) {
  const formData = req.body
  res.render("login", {
    active: {
      login: true
    }
  })
})


authRouter.get('/register', authService.checkNotAuthenticated, function(req, res) {
  res.render("register", {})
})

authRouter.post('/register', authService.checkNotAuthenticated, function(req, res) {
  const formData = req.body

  postService.createUser(formData)
    .then(newUser => {
      res.send("success")
    }).catch(errorMsg => {
      res.status(400).send(errorMsg)
    })

})

authRouter.get('/profile', authService.checkAuthenticated, function(req, res) {
  var qPage = req.query.q_page //submitted questions page
  var sPage = req.query.s_page //submitted surveys page

  if (!qPage) {
    qPage = 1
  }

  if (!sPage) {
    sPage = 1
  }

  var qPages = []
  var sPages = []

  var numQuestions
  var numSurveys
  var currentPageQuestions
  var currentPageSurveys

  var userId = req.user.id

  getService.fetchQuestionsByUser(userId, qPage)
    .then(qResults => {

      numQuestions = qResults[0][0].count
      currentPageQuestions = qResults[1]
      let numPages = Math.ceil(numQuestions / postService.searchResultsPerPage)

      for (var i = 1; i <= numPages; i++) {
        qPages.push(i)
      }

      return getService.fetchSurveysByUser(userId, sPage)
    }).then(sResults => {

      numSurveys = sResults[0][0].count
      currentPageSurveys = sResults[1]
      let numPages = Math.ceil(numSurveys / postService.searchResultsPerPage)

      for (var i = 1; i <= numPages; i++) {
        sPages.push(i)
      }

      res.render("profile", {
        submittedQuestions: {
          active: qPage,
          pages: qPages,
          numberOfRecords: numQuestions,
          questions: currentPageQuestions
        },
        submittedSurveys: {
          active: sPage,
          pages: sPages,
          numberOfRecords: numSurveys,
          surveys: currentPageSurveys
        },
        isAuthenticated: req.isAuthenticated(),
        user: req.user
      })
    })
})

module.exports = authRouter
