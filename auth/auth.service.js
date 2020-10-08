const jwt = require('jsonwebtoken');
const compose = require('composable-middleware');
const { secrets, userRoles } = require('../config');
const User = require('../api/user/user.model');

function isAuth() {
  return (req, res, next) => {
    // allow access_token to be passed through query parameter as well
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = `Bearer ${req.query.access_token}`;
    }
    // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
    if (req.query && typeof req.headers.authorization === 'undefined' && req.cookies) {
      const { token } = req.cookies;
      req.headers.authorization = `Bearer ${token}`;
    }
    if (!req.headers.authorization) return res.status(403).end();
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, secrets.session, (err, authData) => {
      if (err) {
        res.status(401).send(err);
        res.send(err);
      } else {
        req.email = authData.email; // Add user email to request
        next();
      }
    })
  }
}

/**
* Checks if the user role meets the minimum requirements of the route
*/
function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }
  return compose()
    .use(isAuth())
    .use((req, res, next) => {
      User.findOne({ email: req.email }).exec()
        .then(user => {
          if (userRoles.indexOf(user.mg_role) >= userRoles.indexOf(roleRequired)) {
            return next();
          }
          return res.status(403).send('Forbidden');
        })
    });
}

/*
* Returns a jwt token signed by the app secret
*/
function signToken(id, email) {
  return jwt.sign({ _id: id, email }, secrets.session, {
    expiresIn: 60 * 60 * 5
  });
}

module.exports = { signToken, isAuth, hasRole }