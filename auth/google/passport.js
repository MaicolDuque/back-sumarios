const passport = require('passport');
const { google } = require('../../config');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function validateUserExist(User, profile, done) {
  const email = profile._json.email;
  console.log(email)
  User.findOne({ email }).exec()
    .then((user) => {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.',
        });
      }
      return done(null, profile);
    })
    .catch(err => done(err));
}

function setup(User) {
  passport.use(new GoogleStrategy({
    clientID: google.clientID,
    clientSecret: google.clientSecret,
    callbackURL: google.callbackURL
  }, (accessToken, refreshToken, profile, done) => validateUserExist(User, profile, done))); 
}

module.exports = { setup }