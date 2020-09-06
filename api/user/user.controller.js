const jwt = require('jsonwebtoken');

const User = require('./user.model');
const config = require('../../config');

function validationError(res, statusCode) {
  const statusCodeLocal = statusCode || 422;
  return err => res.status(statusCodeLocal).json(err);
}

function handleError(res, statusCode) {
  const statusCodeLocal = statusCode || 500;
  return err => res.status(statusCodeLocal).send(err);
}

/**
 * Get list of users
 * restriction: 'admin'
 */
function index(req, res) {
  return User.find({}).exec()
    .then(users => res.status(200).json(users))
    .catch(handleError(res));
}


function show(req, res) {  
  return User.findById(req.params.id).exec()
    .then(users => res.status(200).json(users))
    .catch(handleError(res));
}


/**
 * Creates a new user
 */
function create(req, res) {
  const newUser = new User(req.body);
  newUser.provider = 'google';
  newUser.role = 'editor';

  return newUser.save()
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        config.secrets.session,
        { expiresIn: 60 * 60 * 5 },
      );
      res.json({ token });
    })
    .catch(validationError(res));
}


/**
 * Delete user
 */
function destroy(req, res) {
  return User.findByIdAndDelete(req.params.id).exec()
    .then(res => res.status(200).json())
    .catch(err => res.status(500).send(err))
}

/**
 * Update user
 */
function update(req, res) {  
  const id = req.params.id;
  return User.findByIdAndUpdate(id, req.body, { new: true }).exec()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).send(err))
}


module.exports = {
  index,
  create,
  destroy,
  show,
  update
};
