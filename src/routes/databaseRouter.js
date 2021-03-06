const express = require("express")
const router = express.Router()
const getService = require("../GETService")

//Define our Routes:
const databaseRouter = express.Router();
const util = require("util")

const editSurveyModel = require("../models/editSurveyModel")

const updateRouter = require("./updateRouter")
const deleteRouter = require("./deleteRouter")
const searchRouter = require("./searchRouter")
const pendingRouter = require("./pendingRouter")
const approveRouter = require("./approveRouter")
const parametersRouter = require("./parametersRouter")
const authService = require("../auth")

databaseRouter.use('/update', updateRouter)
databaseRouter.use('/delete', deleteRouter)
databaseRouter.use('/search', searchRouter)
databaseRouter.use('/pending', pendingRouter)
databaseRouter.use('/approve', approveRouter)
databaseRouter.use('/parameters', parametersRouter)

databaseRouter.use(authService.checkAdmin)


// home page route
databaseRouter.get('/', function(req, res) {
  res.render("home", {
    active: {
      home: true
    }
  });
})


/** Database: Approved **/
databaseRouter.get('/approved/:page', function(req, res) {
  const page = req.params.page
  var pages = []
  var numberOfRecords = 0
  var questions = {}

  //Dropdowns
  var groups = []
  var themes = []
  var keywords = []

  getService.fetchNumberOfQuestionsPromise("approved").then(records => {
    numberOfRecords = records
    numPages = Math.ceil(numberOfRecords / getService.perPage)
    for (var i = 1; i <= numPages; i++) {
      pages.push(i)
    }
    return getService.fetchQuestionsByPagePromise(page, "approved")
  }).then(questionsMetadata => {
    //console.log("GOT - questionsMetadata: " + util.inspect(questionsMetadata))
    questionsMetadata.map(qMetadata => {
      questions[qMetadata.id] = qMetadata // { 1:{..,"options":__,"keywords":___}}, 2:md2, 3:md3}
    })
    let questionIds = Object.keys(questions)
    var promises = questionIds.map(id => {
      return getService.fetchOptionsAndKeywordsForQuestionWithId(id)
    })
    return Promise.all(promises)
  }).then(questionOptionsAndKeywords => {
    //questionOptionsAndKeywords is an ARRAY
    //[firstQuestion, secondQuestion, thirdQuestion]
    //firstQuestion:[options, keywords], secondQuestion:[options,keywords]

    for (var q = 0; q < questionOptionsAndKeywords.length; q++) {
      var question = questionOptionsAndKeywords[q]
      var questionOptions = question[0]
      var questionKeywords = question[1]
      var questionId = questionOptions[0].question_id

      questions[questionId]["options"] = questionOptions.map(row => {
        return {
          "id": row.id,
          "option": row.option,
          "percentage": row.percentage
        }
      })

      questions[questionId]["keywords"] = questionKeywords.map(row => {
        return {
        "id": row.id,
        "keyword": row.keyword
        }
      })
    }

    return getService.fetchGroups()
  }).then(groupsRes => {
    groups = groupsRes
    return getService.fetchThemes()
  }).then(themesRes => {
    themes = themesRes
    return getService.fetchKeywords()
  }).then(keywordsRes => {
    keywords = keywordsRes

    res.render("database/approved", {
      numberOfRecords: numberOfRecords,
      pages: pages,
      active: page,
      questions: questions,
      groups: groups,
      themes: themes,
      keywords: keywords,
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    })
  }).catch( err => {
    res.status(500)
    res.render("error")
  })

})


/** Database: Surveys **/
databaseRouter.get('/surveys/:page', function(req, res) {
  const page = req.params.page
  var pages = []
  var numberOfRecords = 0

  //Dropdowns
  var countries = []
  var populations = []
  var languages = []
  var sampleMethods = []
  var typeOfStudies = []

  getService.fetchNumberOfSurveysPromise("approved").then(records => {
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
  }).then(rows => {
    var populatedModel = populateSurveyModelWithData(editSurveyModel, countries, populations, languages, sampleMethods, typeOfStudies)
    res.render("database/surveys", {
      surveys: rows,
      numberOfRecords: numberOfRecords,
      surveyModel: populatedModel,
      pages: pages,
      active: page,
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    })
  })
})

databaseRouter.get('/surveys/:surveyId/questions/:page', function(req, res) {
  const surveyId = req.params.surveyId
  const page = req.params.page
  var survey = ""
  var questions = {}

  getService.fetchSurveyWithId(surveyId).then(surveyRes => {
    survey = surveyRes
    console.log("GOT - Survey pollname: " + survey.poll_name)
    return getService.fetchQuestionsForSurveyWithId(surveyId, page)
  }).then(questionsMetadata => {
    //console.log("GOT - questionsMetadata: " + util.inspect(questionsMetadata))
    questionsMetadata.map(qMetadata => {
      questions[qMetadata.id] = qMetadata // { 1:{..,"options":__,"keywords":___}}, 2:md2, 3:md3}
    })
    let questionIds = Object.keys(questions)
    var promises = questionIds.map(id => {
      return getService.fetchOptionsAndKeywordsForQuestionWithId(id)
    })
    return Promise.all(promises)
  }).then(questionOptionsAndKeywords => {
    //questionOptionsAndKeywords is an ARRAY
    //[firstQuestion, secondQuestion, thirdQuestion]
    //firstQuestion:[options, keywords], secondQuestion:[options,keywords]

    for (var q = 0; q < questionOptionsAndKeywords.length; q++) {
      var question = questionOptionsAndKeywords[q]
      var questionOptions = question[0]
      var questionKeywords = question[1]
      var questionId = questionOptions[0].question_id

      questions[questionId]["options"] = questionOptions.map(row => {
        return {
          "option": row.option,
          "percentage": row.percentage
        }
      })
      questions[questionId]["keywords"] = questionKeywords.map(row => row.keyword)
    }

    res.send({
      survey: survey,
      questions: questions,
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    })
  })

})

//Survey Details
databaseRouter.get('/survey_partial/:surveyId', function(req, res) {
  const surveyId = req.params.surveyId

  //Dropdowns
  var countries = []
  var populations = []
  var languages = []
  var sampleMethods = []
  var typeOfStudies = []

  getService.fetchCountries()
    .then(countriesRes => {
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
      return getService.fetchSurveyWithId(surveyId)
    }).then(survey => {
      var pending = true
      if (survey.approved) {
        pending = false
      }
      var populatedModel = populateSurveyModelWithData(editSurveyModel, countries, populations, languages, sampleMethods, typeOfStudies)
      res.render("partials/database/surveyDetailsTemplate", {
        survey: survey,
        surveyModel: populatedModel,
        layout: false,
        pending: pending,
        isAuthenticated: req.isAuthenticated(),
        user: req.user
      }, function(err, html) {
        res.send(html)
      })
    })

})



databaseRouter.get('/parameters',function(req, res) {
  res.render("database/parameters", {
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  })
})

function populateSurveyModelWithData(surveyModel, countries, populations, languages, sampleMethods, typeOfStudies) {
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
  return {
    "formItems": formItems
  }
}

module.exports = databaseRouter
