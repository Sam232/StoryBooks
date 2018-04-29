const router = require("express").Router();

const {ensureAuthentication, ensureGuest} = require("../helper/auth");

const {Story} = require("../models/Stories");

router.get("/", ensureGuest, (req, res) => {
  res.render("index/welcome");
});

router.get("/dashboard", ensureAuthentication, (req, res) => {
  var userId = res.locals.user._id;
  Story.find({user: userId}).then((stories) => {
    if(stories.length > 0){
      return res.render("index/dashboard", {
        stories
      });
    }
    res.render("index/dashboard", {
      stories: false
    });
  })
  .catch((err) => {
    if(err){
      console.log("Unable To Fetch User\'s Stories");
    }
  });
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

module.exports = router;