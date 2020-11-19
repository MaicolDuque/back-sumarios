
const Contact = require("./contact.model");
const ContactList = require("../contact-list/contact-list.model");
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
 * Return all Contact
 */
function index(req, res) {
  return Contact.find({}).exec()
    .then(lists => res.status(200).json(lists))
    .catch(handleError(res));
}

/**
 * 
 * Return Contacts 
 */
function contact(req, res) {
  const { _id } = req.params
  return ContactList.findOne({ _id }, { mg_contacts: 1 })
    .populate({ select: { c_name: 1, c_email: 1 }, path: 'mg_contacts', model: 'Contact', }).exec()
    .then(lists => res.status(200).json(lists))
    .catch(handleError(res));
}

/**
 * Creates a new Contact
 */
function create(req, res) {
  const { c_name, c_email, id_lista, id_lista_default } = req.body
  return Contact.findOne({ c_email }).exec()
    .then(result => {
      if (result) {
        res.json({
          caution: true,
          msg: 'El contacto que desea agregar ya existe.'
        })
      } else {
        const newContact = new Contact({ c_name, c_email });
        return newContact.save()
          .then((user) => {
            return ContactList.updateMany({ $or: [{ _id: id_lista }, { _id: id_lista_default }] }, { $push: { mg_contacts: user._id } }).exec()
          })
          .then(result => res.status(200).json({
            caution: false,
            msg: 'El contacto se agregó exitosamente.',
            result: result
          }))
          .catch(validationError(res));
      }
    })
    .catch(
      validationError(res)
    )
}

/**
 * Delete Contact
 */
function destroy(req, res) {
  const { contactid } = req.params
  return ContactList.updateMany({ mg_contacts: { _id: contactid } }, { $pull: { mg_contacts: contactid } }).exec()
    .then(() => { return Contact.findByIdAndDelete(contactid).exec() })
    .then(result => res.status(200).json({
      error: false,
      msg: 'El contacto se eliminó exitosamente.',
      result: result
    }))
    .catch(validationError(res));
}

/**
 * Update Contact
 */
function update(req, res) {
  console.log(req.body)
  const id = req.params.id;
  return Contact.findByIdAndUpdate(id, req.body, { new: true }).exec()
    .then(user => res.status(200).json({
      error:false,
      msg: "Contacto actualizado.",
      data: user
    }))
    .catch(err => res.status(500).json({
      error: true,
      msg: "El contacto no fue actualizado.",
      data: err
    }))
}

module.exports = {
  index,
  create,
  destroy,
  contact,
  update
}