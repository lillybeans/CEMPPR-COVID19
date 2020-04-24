//Import Express, BodyParser, Handlebars
const express = require("express")
const bodyParser = require("body-parser")
const exphbs = require("express-handlebars")

//Import our custom files/dependencies: MySQL, our routes
const mysqlConnection = require("./connection")

const IndexRoute = require("./routes/index.js")
const QuestionRoutes = require("./routes/questions")

var app = express()
app.engine(".hbs", exphbs({extname: '.hbs'})) //modify handlebars extension to be ".hbs"
app.set("view engine", ".hbs")

app.use(bodyParser.json())

//Define our Routes:
app.use("/", function (req,res){
  res.render("home")
})

app.use("/questions", QuestionRoutes) //use "/questions" instead of "/routes/questions" in the browser

app.listen(3000) //listen to port 3000
