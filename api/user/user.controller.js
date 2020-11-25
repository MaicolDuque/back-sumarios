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
  return User.find({}).populate({ path: 'mg_contact_lists', model: 'ContactList' }).exec()
    .then(users => res.status(200).json(users))
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

async function verifyTrue(req, res) {
  try {
    const { email } = req.body
    await User.findOne({ email })
      .populate({ select: { _id: 1 }, path: 'mg_contact_lists', model: 'ContactList', match: { name: "Todos" } }).exec()
      .then(user => {
        if (user.mg_status) {
          const token = jwt.sign(
            { _id: user._id, email: user.email, mg_role: user.mg_role, mg_contact_lists: user.mg_contact_lists[0]._id, name_magazine: user.mg_name },
            config.secrets.session,
            { expiresIn: 60 * 60 * 5 },
          );
          res.json({ token: `Bearer ${token}` });
        } else {
          res.json({
            caution: true,
            msg: 'Usuario no activo.'
          })
        }
      })
  } catch (error) {
    res.json({
      error: true,
      msg: 'Usuario no encontrado, verifique sus credenciales y vuelva a intentarlo.'
    })
  }
}

/**
 * Activate User
 */

function updateStatus(req, res) {
  const { id } = req.params
  const status = {
    mg_status: true
  }
  return User.findByIdAndUpdate(id, status, {new: true}).exec()
    .then(user => {
      res.status(200).json({
        caution: false,
        msg: "Se ha activado el editor.",
        result: user
      })
    })
    .catch(user => {
      res.status(500).json({
        error: true,
        msg: "El editor no pudo ser activado.",
        resut: user
      })
    })
}

/**
 * Return User pending
 */
function getUserPending(req, res) {
  return User.find({ mg_status: false }).exec()
    .then(result => {
      res.status(200).json({
        caution: false,
        msg: "Usuarios pendientes de activación",
        result: result
      })
    })
    .catch(result => {
      res.status(400).json({
        error: true,
        msg: "Problemas con la búsqueda",
        result: result
      }
      )
    })
}

/**
 * Return all volumes by id User
 */
function getVolumesByUserId(req, res) {
  const { id } = req.params
  return User.findOne({ _id: id }, { mg_list_volumes: 1, _id: 0 })
    .populate({ select: { url: 1, description: 1 }, path: 'mg_list_volumes', model: 'Volume' }).exec()
    .then(users => res.status(200).json(users))
    .catch(handleError(res));
}


/**
 * Creates a new user
 */
function create(req, res) {
  if (req.body !== "") {

    const newPubliser = {
      mg_role: 'editor',
      mg_name: req.body.mg_name,
      email: req.body.email,
      mg_status: req.body.mg_status ? req.body.mg_status : false,
      mg_urlMagazine: req.body.mg_urlMagazine,
      mg_contact_lists: []
    }

    return User.findOne({ email: newPubliser.email }).exec()
      .then(result => {
        if (result) {
          res.json({
            caution: true,
            msg: "La solicitud ya ha sido enviada.",
            result: result
          })
        } else {
          console.log(result)
          const newUser = new User(newPubliser);
          return newUser.save()
            .then(
              result => res.status(200).json({
                caution: false,
                msg: "Solicitud enviada",
                result: result
              }))
            .catch(validationError(res));
        }
      })
  } else {
    return res.json({
      error: "error",
      msg: "Ingrese la información correspondiente."
    })
  }
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
    .then(user => res.status(200).json({
      error: false,
      msg: "Los datos se han modificado correctamente.",
      result: user
    }))
    .catch(err => res.status(500).send(err))
}


module.exports = {
  index,
  create,
  destroy,
  show,
  update,
  getVolumesByUserId,
  verifyTrue,
  getUserPending,
  updateStatus
};
