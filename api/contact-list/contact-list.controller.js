
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
  return ContactList.find({}).populate({ path: 'mg_contacts', model: 'Contact' }).exec()
    .then(lists => res.status(200).json(lists))
    .catch(handleError(res));
}

/**
 * Return specific ContactList
 */
async function contactList(req, res) {
  try {
    const mg_contact_lists = req.body
    const allContactList = await ContactList.find({}).populate({ path: 'mg_contacts', model: 'Contact', select: 'c_name c_email' }).exec()
    const contactsListReturn = [];
    const dataContacts = [];
    mg_contact_lists.map(element => {
      allContactList.filter(contactListId => {
        contactListId._id == element ? (contactsListReturn.push({
          id: contactListId._id,
          name: contactListId.name,
          description: contactListId.description,
          mg_contacts: contactListId.mg_contacts
        })) : (null)
      })
    });

    res.send(contactsListReturn)
  } catch (error) {
    return handleError(res)
  }
}
/**
 * Function that removes repeated objects
 */
function distictObject(arrayObject){
  const distinctObjects = [];
  const mapObjects = new Map();
  for (const data of arrayObject) {
    if (!mapObjects.has(data.id)) {
      mapObjects.set(data.id, true);    // set any value to Map
      distinctObjects.push({
        id: data.id,
        name: data.name,
        email: data.email
      });
    }
  }
  return distinctObjects
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
    .then(result => res.send(result))
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
  contactList
}