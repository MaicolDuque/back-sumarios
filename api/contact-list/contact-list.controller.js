
const ContactList = require("./contact-list.model");
const User = require('../user/user.model');

function validationError(res, statusCode) {
  const statusCodeLocal = statusCode || 422;
  return err => res.status(statusCodeLocal).json(err);
}

function handleError(res, statusCode) {
  const statusCodeLocal = statusCode || 500;
  return err => res.status(statusCodeLocal).send(err);
}

/**
 * Return all ContactList
 */
function index(req, res) {
  return ContactList.find({}).exec()
    .then(lists => res.status(200).json(lists))
    .catch(handleError(res));
}


/**
 * Return all ContactList by User ID - Editor
 */
function showContactListsByUser(req, res) {
  const { _id } = req.params
  return User.findOne({ _id }, { mg_contact_lists: 1 })
    .populate({ select: { name: 1, description: 1, createdAt: 1 }, path: 'mg_contact_lists', model: 'ContactList' }).exec()
    .then(lists => res.status(200).json(lists))
    .catch(handleError(res));
}

/**
 * Creates a new ContactList
 */
function create(req, res) {
  const { id_user, mg_contact_lists } = req.body
  const newList = new ContactList(mg_contact_lists);
  return newList.save()
    .then((user) => {
      return User.updateOne({ _id: id_user }, { $push: { mg_contact_lists: user } })
    })
    .then(result => res.status(200).json({
      error: false,
      msg: 'La lista de contactos se creó exitosamente.',
      result: result
    }))
    .catch(validationError(res));
}


/**
 * Delete ContactList
 */
function destroy(req, res) {
  const { id } = req.params
  console.log(id)
  return User.updateMany({ mg_contact_lists: { _id: id } }, { $pull: { mg_contact_lists: id } }).exec()
    .then(() => { return ContactList.findByIdAndDelete(id).exec() })
    .then(result => res.status(200).json({
      error: false,
      msg: 'La lista de contactos se eliminó exitosamente.',
      result: result
    }))
    .catch(validationError(res));
}

/**
 * Update ContactList
 */

function update(req, res) {
  const id = req.params.id;
  console.log(req.body)
  return ContactList.findByIdAndUpdate(id, req.body, { new: true }).exec()
    .then(user => res.status(200).json({
      error:false,
      msg: "Lista de Contactos actualizada.",
      data: user
    }))
    .catch(err => res.status(500).json({
      error: true,
      msg: "La lista no fue actualizado.",
      data: err
    }))
}


module.exports = {
  index,
  create,
  destroy,
  showContactListsByUser,
  update
}