//Import Express, BodyParser, Handlebars
const express = require("express")
const bodyParser = require("body-parser")
const exphbs = require("express-handlebars")

//Import our custom files/dependencies: MySQL, our routes
const mysqlConnection = require("./connection")

const questionsRouter = require("./routes/questions")

var app = express()
app.engine("hbs", exphbs({extname: '.hbs'})) //modify handlebars extension to be ".hbs"
app.set("view engine", "hbs")

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public')); //static files

//Define our Routes:
var indexRouter = express.Router();

// home page route
indexRouter.get('/', function(req, res) {
    res.render("home");
})

indexRouter.get('/submit', function(req, res) {
    res.render("submit")
})

indexRouter.get('/about', function(req, res) {
    res.render("about")
})

app.use('/', indexRouter)

//other routers
app.use("/questions", questionsRouter) //use "/questions" instead of "/routes/questions" in the browser

app.listen(3000) //listen to port 3000
