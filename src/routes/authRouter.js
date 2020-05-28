const express = require("express")
const router = express.Router()
const getService = require("../GETService")

//Define our Routes:
const authRouter = express.Router();
const util = require("util")

authRouter.get('/login', function(req, res) {
  res.render("login", {
    active: {
      login: true
    }
  })
})

authRouter.post('/login', function(req, res) {
  const formData = req.body
  res.render("login", {
    active: {
      login: true
    }
  })
})

authRouter.get('/register', function(req, res) {
  res.render("register", {
  })
})

authRouter.post('/register', function(req, res) {
  const formData = req.body
  console.log(formData)
  res.render("register", {
  })
})

module.exports = authRouter
