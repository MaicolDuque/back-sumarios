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
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, 'secreto', { algorithm: 'RS256' }, (err, authData) => {
    if (err) {
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
function signToken(id) {
  return jwt.sign({ _id: id, name: 'maicol' }, 'secreto', {
    expiresIn: '1h'
  });
}

module.exports = { signToken, isAuth } 