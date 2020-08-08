const jwt = require('jsonwebtoken');
// const { model } = require('../api/user/user.model');


function isAuth(req, res, next) {
  // allow access_token to be passed through query parameter as well
  if (req.query && req.query.hasOwnProperty('access_token')) {
    req.headers.authorization = `Bearer ${req.query.access_token}`;
  }
  // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
  if (req.query && typeof req.headers.authorization === 'undefined' && req.cookies) {
    const { token } = req.cookies;
    req.headers.authorization = `Bearer ${token}`;
  }

  jwt.verify(req.headers.authorization, process.env.SECRETS_SESSION, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      console.log("authData");
      console.log(authData);
      return req.authData = authData;
    }
  })
}

/*
* Returns a jwt token signed by the app secret
*/
function signToken(id) {
  return jwt.sign({ _id: id }, process.env.SECRETS_SESSION, {
    expiresIn: 60 * 60 * 5,
  });
}

module.exports = { signToken } 