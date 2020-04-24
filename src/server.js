//Import Express, BodyParser, Handlebars
const express = require("express")
const bodyParser = require("body-parser")
//Import our custom files/dependencies: MySQL, our routes
const mysqlConnection = require("./connection")

const QuestionRoutes = require("./routes/questions")

var app = express()

app.use(bodyParser.json())
app.use(express.static("public")); //static files

//Define our Routes:

// get an instance of router
var router = express.Router();

// home page route (http://localhost:8080)
router.get('/home', function(req, res) {
    res.sendFile(__dirname + "/public/" + "home.html")
});

// about page route (http://localhost:8080/about)
router.get('/about', function(req, res) {
    res.send('im the about page!');
});

// apply the routes to our application
app.use('/', router);

app.use("/questions", QuestionRoutes) //use "/questions" instead of "/routes/questions" in the browser

app.listen(3000) //listen to port 3000
