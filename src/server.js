//Import Express, BodyParser, Handlebars
const express = require("express")
const bodyParser = require("body-parser")
const exphbs = require("express-handlebars")
const helpers = require("./helpers") //handlebars helpers
const bcrpyt = require("bcrypt")
const mysqlConnection = require("./connection")
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)

//Import our custom files/dependencies: MySQL, our routes

const indexRouter = require("./routes/indexRouter")
const submitRouter = require("./routes/submitRouter")
const questionsRouter = require("./routes/questionsRouter")
const databaseRouter = require("./routes/databaseRouter")
const pendingRouter = require("./routes/pendingRouter")
const updateRouter = require("./routes/updateRouter")
const deleteRouter = require("./routes/deleteRouter")

//const util = require("util"), util.inspect

var hbs = exphbs.create({
  helpers: helpers,
  extname: '.hbs'
})

var app = express()

// var sessionStore = new MySQLStore({
//   /** session store properties **/
// }, mysqlConnection);

//Handlebars
app.engine("hbs", hbs.engine)
app.set("view engine", "hbs")

//Parsing form data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Static files
app.use(express.static(__dirname + '/public')); //static files

//Routers
app.use('/', indexRouter)
app.use("/submit", submitRouter)
app.use("/questions", questionsRouter) //use "/questions" instead of "/routes/questions" in the browser
app.use("/database", databaseRouter)
app.use("/pending", pendingRouter)

app.listen(3000) //listen to port 3000
