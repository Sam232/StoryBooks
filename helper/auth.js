module.exports = {
  ensureAuthentication: (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("error_msg", "Not Authenticated");
    res.redirect("/");
  },
  ensureGuest: (req, res, next) => {
    if(req.isAuthenticated()){
      return res.redirect("/dashboard");
    }
    next();
  }
}