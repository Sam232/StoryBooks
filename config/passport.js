const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

//Load Keys
const keys = require("./keys");

//Models
const {User} = require("../models/Users");

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "/auth/google/callback",
    proxy: true
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({googleId: profile.id}).then((user) => {
      if(user){
        return done(null, user);
      }
      new User({
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familName,
        email: profile.emails[0].value,
        imageLink: image.url
      }).save().then((user) => {
        if(user){
          return done(null, user);
        }
        done(null, false)
      })
      .catch((err) => {
        if(err){
          done(null, false);
        }
      });
    })
    .catch((err) => {
      if(err){
        done(null, false);
      }
    })
  }));
 
  passport.serializeUser((user, done) => {
    done(null, {id: user.id});
  });

  passport.deserializeUser(({id}, done) => {
    User.findOne(id, (err, user) => {
      done(err, user)
    });
  });

}

