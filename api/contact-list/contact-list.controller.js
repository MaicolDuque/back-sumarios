
const ContactList = require("./contact-list.model");
const User = require("../user/user.model");

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
  return ContactList.find({}).populate({ path: 'mg_contacts', model: 'Contact' }).exec()
    .then(lists => res.status(200).json(lists))
    .catch(handleError(res));
}

/**
 * Return all ContactList by User ID - Editor
 */
function showContactListsByUser(req, res) {
  const { _id } = req.params
  return User.findOne({ _id }, { mg_contact_lists: 1 })
    .populate({ select: { name: 1, description: 1 }, path: 'mg_contact_lists', model: 'ContactList' }).exec()
    .then(lists => res.status(200).json(lists))
    .catch(handleError(res));
}

/**
 * Creates a new ContactList
 */
function create(req, res) {
  const newList = new ContactList(req.body);
  return newList.save()
    .then((user) => {
      res.json(user);
    })
    .catch(validationError(res));
}


/**
 * Delete ContactList
 */
function destroy(req, res) {
  // return res.json({err:"sdsdsdsd"});
  return ContactList.findByIdAndDelete(req.params.id).exec()
    .then(res => res.status(200).json())
    .catch(err => res.status(500).send(err))
}


module.exports = {
  index,
  create,
  destroy,
  showContactListsByUser
}