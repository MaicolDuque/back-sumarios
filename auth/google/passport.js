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

  passport.serializeUser(function (user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
  });
}

module.exports = { setup }