//Import Express, BodyParser, Handlebars
const express = require("express")
const bodyParser = require("body-parser")
const exphbs = require("express-handlebars")
const helpers = require("./helpers") //handlebars helpers

//Import our custom files/dependencies: MySQL, our routes

const indexRouter = require("./routes/indexRouter")
const questionsRouter = require("./routes/questionsRouter")
const adminRouter = require("./routes/adminRouter")

//const util = require("util"), util.inspect

var hbs = exphbs.create({
  helpers: helpers,
  extname: '.hbs'
})

var app = express()
app.engine("hbs", hbs.engine)

app.set("view engine", "hbs")

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public')); //static files

app.use('/', indexRouter)
//other routers
app.use("/questions", questionsRouter) //use "/questions" instead of "/routes/questions" in the browser

//admin Routes
app.use("/admin", adminRouter)

app.listen(3000) //listen to port 3000
