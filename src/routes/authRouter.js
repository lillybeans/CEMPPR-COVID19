const express = require("express")
const router = express.Router()
const postService = require("../POSTService")
const passport = require('passport')

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

authRouter.post('/login', passport.authenticate('local', {
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

authRouter.get('/register', function(req, res) {
  res.render("register", {})
})

authRouter.post('/register', function(req, res) {
  const formData = req.body

  postService.createUser(formData)
    .then(newUser => {
      res.send("success")
    }).catch(errorMsg => {
      res.status(400).send(errorMsg)
    })

})

module.exports = authRouter
