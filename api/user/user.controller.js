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
const index = async (req, res) => {
  await User.find({}).populate({ path: 'mg_contact_lists', model: 'ContactList' }).exec()
    .then(users => { return res.status(200).json(users) })
    .catch(handleError(res));
}


function show(req, res) {
  return User.findById(req.params.id).exec()
    .then(users => res.status(200).json(users))
    .catch(handleError(res));
}

/**
 * 
 * Verify user
 */

const verifyTrue = async (req, res) => {
  try {
    await User.findOne(req.body).exec()
      .then(user => {
        if (user.mg_status) {
          const token = jwt.sign(
            { _id: user._id, email: user.email },
            config.secrets.session,
            { expiresIn: 60 * 60 * 5 },
          );
          return res.json({ token: `Bearer ${token}` });
        } else {
          return res.json({
            msg: 'Usuario no activo.'
          })
        }
      })
  } catch (error) {
    res.json({
      msg: 'No se encontró usuario.'
    })
  }
}


/**
 * Creates a new user
 */
const create = async (req, res) => {
  if(req.body !== ""){
    const newPubliser = {
      mg_role: 'editor',
      mg_name: req.body.mg_name,
      email: req.body.email,
      mg_status: true,
      mg_urlMagazine: req.body.mg_urlMagazine,
      mg_contact_lists: ''
    }
    const newUser = new User(newPubliser);
    return newUser.save()
      .then(res => res.status(200).json({
        msg: "Solicitud enviada"
      }))
      .catch(validationError(res));
  } else{
    return res.json({
      error: "error",
      msg: "Ingrese la información correspondiente."
    })
  }
  return res.json({
    msg: "Enviado"
  })
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
  update,
  verifyTrue
};
