const express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");
var cookieParser = require("cookie-parser");
var passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var session = require("express-session");
var flash = require("connect-flash");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

// require('./passportConfig/passport');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  session({ secret: "mysupersecret", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// View engine setup
app.engine(".hbs", exphbs({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

configRoutes(app);

require("./routes/index")(app, passport);
require("./routes/passport")(passport);

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:" + port);
});
