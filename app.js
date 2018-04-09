const express = require("express");
const mongoose = require("mongoose");

const {mongooseConnect} = require("./config/database");

var app = express();

mongooseConnect(mongoose);

app.get("/", (req, res) => {
  res.send("welcome");
});

var PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});