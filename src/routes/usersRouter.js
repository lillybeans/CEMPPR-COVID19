const express = require("express")
const usersRouter = express.Router()
const getService = require("../GETService")
const postService = require("../POSTService")

//Define our Routes:
const util = require("util")
const authService = require("../auth")

usersRouter.use(authService.checkAdmin)

usersRouter.get('/approved', function(req, res) {
  getService.getUsers("approved").then(userResults => {
    res.render("users/approvedUsers", {
      users: userResults,
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    })
  })
})

usersRouter.get('/pending', function(req, res) {
  getService.getUsers("pending").then(userResults => {
    res.render("users/pendingUsers", {
      users: userResults,
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    })
  })
})

module.exports = usersRouter
