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
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  imageLink: {
    type: String,
    required: false
  }
});

var User = mongoose.model("users", UserSchema)
module.exports = {User};