const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const path = require("path");

//Connect To Production MongoDB Database
const {mongooseConnect} = require("./config/database");
mongooseConnect(mongoose);

//Passport Config
require("./config/passport")(passport);

//Load Routes
const auth = require("./routes/auth");
const index = require("./routes/index");

var app = express();

//Express Handlebars Middleware
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//Express Static Directory
app.use(express.static(path.join(__dirname, "public")));

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

//Global Variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//Express Routes
app.use("/auth", auth);
app.use("/", index);

var PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});