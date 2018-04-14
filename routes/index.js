const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("index/welcome");
});

router.get("/dashboard", (req, res) => {
  var user = res.locals.user;
  res.render("index/dashboard", {
    name: user.firstName+" "+user.lastName
  });
});

router.get("/stories/", (req, res) => {
  res.render("index/publicStories");
});

router.get("/stories/my", (req, res) => {
  res.render("index/myStories");
});


module.exports = router;