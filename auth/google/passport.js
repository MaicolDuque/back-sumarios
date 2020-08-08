const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function setup() {
  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
    function(accessToken, refreshToken, profile, done) {   
      console.log("profile");
      console.log(profile);        
      return done(null, profile);
    }
  ));
}

module.exports = { setup }