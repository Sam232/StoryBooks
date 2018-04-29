const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");

//Connect To Production MongoDB Database
const {mongooseConnect} = require("./config/database");
mongooseConnect(mongoose);

//Passport Config
require("./config/passport")(passport);

//Load Routes
const auth = require("./routes/auth");
const index = require("./routes/index");
const stories = require("./routes/stories");

//Handlebars Helpers
const {truncate, stripTags, formatDate, select, editIcon} = require("./helper/hbs");

var app = express();

//Express Handlebars Middleware
app.engine("handlebars", exphbs({
  helpers: {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
  },
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// exphbs.registerHelper("parseHTML", (html) => {
//   console.log(html);
//   return "working"
// });

//Express Static Directory
app.use(express.static(path.join(__dirname, "public")));

//BodyParser Middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//Cookie Parser Middleware
// app.use(cookieParser());

//Express Session Middleware
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true 
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect-flash Middleware
app.use(flash());

//MethodOverride Middleware
app.use(methodOverride("_method"));

//Global Variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.error_msg = req.flash("error_msg");
  res.locals.success_msg = req.flash("success_msg");

  next();
});

//Express Routes
app.use("/auth", auth);
app.use("/", index);
app.use("/stories", stories);

var PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});