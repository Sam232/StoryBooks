const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

//Connect To Production MongoDB Database
const {mongooseConnect} = require("./config/database");
mongooseConnect(mongoose);

//Passport Config
require("./config/passport")(passport);

//Load Routes
const auth = require("./routes/auth");

var app = express();

//Express Session Middleware
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true 
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("welcome");
});

//Express Routes
app.use("/auth", auth);

var PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});