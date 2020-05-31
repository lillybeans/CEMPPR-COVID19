const express = require("express")
const router = express.Router()
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
  res.render("profile", {
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  })
})

module.exports = authRouter
