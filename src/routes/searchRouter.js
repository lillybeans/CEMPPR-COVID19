const express = require("express")
const router = express.Router()
const postService = require("../POSTService")

//Define our Routes:
const searchRouter = express.Router();
const util = require("util")

//search questions
searchRouter.post('/questions', function(req, res) {
  const text = req.body
  postService.searchQuestion(text).then(rows => {
    res.send(rows)
  })
})

module.exports = searchRouter
