const jwt = require('jsonwebtoken');
const { secrets } = require('../config');
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
  if(!req.headers.authorization) return res.status(403).end();
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, secrets.session, (err, authData) => {
    if (err) {
      res.status(401).send(err);
      res.send(err);
    } else {
      console.log("OK")
      next();
    }
  })
}

/*
* Returns a jwt token signed by the app secret
*/
function signToken(id, email) {
  return jwt.sign({ _id: id, email }, secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

module.exports = { signToken, isAuth } 