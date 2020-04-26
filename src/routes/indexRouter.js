const express = require("express")
const router = express.Router()
const mysqlConnection = require("./connection")

const questionInfoModel = require("../models/questionInfoModel")

//Define our Routes:
const indexRouter = express.Router();


// home page route
indexRouter.get('/', function(req, res) {
    res.render("home", {active: { home: true }});
})

indexRouter.get('/submit/question', function(req, res) {

  mysqlConnection.query("SELECT survey from Responses", (error, rows, fields) => {
    if(error) {
      console.log(error)
      return
    }

    const allSurveys = rows.map(row => row.survey)
    res.render("submit/question", {active: { submit: true }, questionInfoModel: questionInfoModel, allSurveys: allSurveys})
  })

})

indexRouter.get('/submit/survey', function(req, res) {
    res.render("submit/survey", {active: { submit: true }})
})

indexRouter.get('/about', function(req, res) {
    res.render("about", {active: { about: true }})
})

module.exports = indexRouter
