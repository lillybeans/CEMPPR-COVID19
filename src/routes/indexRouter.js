const express = require("express")
const router = express.Router()
const getService = require("../GETService")

//Define our Routes:
const indexRouter = express.Router();
const util = require("util")

const authRouter = require("./authRouter")

indexRouter.use('/', authRouter)

// home page route
indexRouter.get('/', function(req, res) {
  res.render("home", {
    active: {
      home: true,
    },
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
})

indexRouter.get('/about', function(req, res) {
  res.render("about", {
    active: {
      about: true
    },
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  })
})

indexRouter.get('/unauthorized', function(req, res) {
  res.render("unauthorized", {
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  })
})


indexRouter.get('/test', function(req, res) {
  res.render("test")
})


module.exports = indexRouter
