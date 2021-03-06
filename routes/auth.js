const router = require("express").Router();
const passport = require("passport");

const {ensureAuthentication} = require("../helper/auth");

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback", 
  passport.authenticate("google", {failureRedirect: "/login"}), 
    (req, res) => {
      res.redirect("/dashboard");
    }
);

router.get("/verify", (req, res) => {
  if(req.user){
    console.log(req.user);
  }
  else{
    console.log("Not Authenticated");
  }
});

router.get("/logout", ensureAuthentication, (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;