const mongoose = require("mongoose");

var Schema = mongoose.Schema;
var UserSchema = new Schema({
  googleId: {
    type: Number,
    required: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lasttName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  imageLink: {
    type: String,
    required: true
  }
});

var User = mongoose.model("users", UserSchema)
module.exports = {User};