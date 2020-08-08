const passport = require('passport');
const { google } = require('../../config');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function setup() {
  passport.use(new GoogleStrategy({
    clientID: google.clientID,
    clientSecret: google.clientSecret,
    callbackURL: google.callbackURL
  },
    function(accessToken, refreshToken, profile, done) {   
      console.log("profile");
      console.log(profile);        
      return done(null, profile);
    }
  ));
}

module.exports = { setup }