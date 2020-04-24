//Import Express, BodyParser, Handlebars
const express = require("express")
const bodyParser = require("body-parser")
const exphbs = require("express-handlebars")

//Import our custom files/dependencies: MySQL, our routes
const mysqlConnection = require("./connection")

const QuestionRoutes = require("./routes/questions")

var app = express()
app.engine("hbs", exphbs({extname: '.hbs'})) //modify handlebars extension to be ".hbs"
app.set("view engine", "hbs")

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public')); //static files

//Define our Routes:

// get an instance of router
var router = express.Router();

// home page route (http://localhost:8080)
router.get('/', function(req, res) {
    res.render("home");
})

// about page route (http://localhost:8080/about)
router.get('/submit', function(req, res) {
    res.render("submit")
})

// apply the routes to our application
app.use('/', router)

app.use("/questions", QuestionRoutes) //use "/questions" instead of "/routes/questions" in the browser

app.listen(3000) //listen to port 3000
