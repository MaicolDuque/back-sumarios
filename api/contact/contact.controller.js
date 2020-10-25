
const Contact = require("./contact.model");
const ContactList = require("../contact-list/contact-list.model");

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
 * Creates a new Contact
 */
function create(req, res) {
  const { c_name, c_email, id_lista } = req.body
  const newList = new Contact({c_name, c_email});
  return newList.save()
  .then((user) => {
    return ContactList.updateOne( { _id: id_lista }, { $push: { mg_contacts: user._id } })
  })
  .then( result => res.send(result))
  .catch(validationError(res));
}

/**
 * Delete Contact
 */
function destroy(req, res) {
  const { contactid, listid } = req.params
  console.log(req.params)
  return ContactList.findByIdAndUpdate(listid, { $pull: { mg_contacts: { _id: contactid } } }).exec()
    .then(res => { return Contact.findByIdAndDelete(contactid).exec() })
    .then(res => res.status(200).json())
    .catch(validationError(res))
}

module.exports = {
  index,
  create,
  destroy
}