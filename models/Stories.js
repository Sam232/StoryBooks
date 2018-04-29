const mongoose = require("mongoose");

var Schema = mongoose.Schema;
var StorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "public"
  },
  allowComment: {
    type: Boolean,
    default: true
  },
  body: {
    type: String,
    required: true
  },
  comments: [{
      commentBody: {
        type: String
      },
      commentDate: {
        type: Date,
        default: Date.now()
      },
      commentUser: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  date: {
    type: Date,
    default: Date.now()
  }  
});

var Story = mongoose.model("stories", StorySchema, "stories");

module.exports = {Story};