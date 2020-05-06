const express = require("express")
const router = express.Router()
const mysqlConnection = require("../connection") //relative path

router.get("/", (req, res) => {
  mysqlConnection.query("SELECT question from Questions", (error, rows, fields) => {
    if(error) {
      console.log(error)
      return
    }

    const allQuestions = rows.map(row => row.question)
    res.send(allQuestions)
  })
})

router.get("/:question_id", (req, res) => {
  const questionId = req.params.question_id
  const questionByIdQuery = "SELECT question from Questions WHERE id=" + questionId
  mysqlConnection.query(questionByIdQuery, (error, rows, fields) => {
    if(error) {
      console.log(error)
      return
    }

    const question = rows[0].question
    res.send(question)
  })
})

module.exports = router
