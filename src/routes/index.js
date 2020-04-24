const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.sendFile("index.html") //we already specified to look under "public"
})

router.get("/home", (req,res) => {
  res.sendFile( __dirname + "/public/" + "home.html")
})

router.get("/submit", (req,res) => {
  res.sendFile("submit.html")
})

router.get("/about", (req,res) => {
  res.sendFile("about.html")
})

module.exports = router
