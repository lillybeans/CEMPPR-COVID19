const express = require("express")
const router = express.Router()
const getService = require("../GETService")
const authService = require("../auth")

//Define our Routes:
const parametersRouter = express.Router();
const util = require("util")

parametersRouter.get('/countries', function(req, res) {
  res.render("database/parameters/countries", {
    active: {
      home: true
    }
  });
})

module.exports = parametersRouter
