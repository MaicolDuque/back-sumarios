
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
 * 
 * Return Contacts 
 */
async function contact(req, res) {
  try {
    const mg_contact_lists = req.body
    const allContactList = await ContactList.find({}).populate({ path: 'mg_contacts', model: 'Contact', select: 'c_name c_email' }).exec()
    const contactsListReturn = [];
    const dataContacts = [];
    mg_contact_lists.map(element => {
      allContactList.filter(contactListId => {
        contactListId._id == element ? (contactsListReturn.push({
          mg_contacts: contactListId.mg_contacts
        })) : (null)
      })
    });

    contactsListReturn.forEach(element => {
      element.mg_contacts.forEach((element) => {
        {
          dataContacts.push({
            id: element._id,
            name: element.c_name,
            email: element.c_email
          })
        }
      })
    });

    distictObject(dataContacts)

    res.send(distictObject(dataContacts))
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
 * Creates a new Contact
 */
function create(req, res) {
  const { c_name, c_email, id_lista } = req.body
  const newList = new Contact({ c_name, c_email });
  return newList.save()
    .then((user) => {
      return ContactList.updateOne({ _id: id_lista }, { $push: { mg_contacts: user._id } })
    })
    .then(result => res.send(result))
    .catch(validationError(res));
}

/**
 * Delete Contact
 */
function destroy(req, res) {
  const { contactid } = req.params
  return ContactList.updateMany({mg_contacts: {_id: contactid}}, { $pull: { mg_contacts: { _id: contactid } } }).exec()
    .then(() => { return Contact.findByIdAndDelete(contactid).exec() })
    .then(result => res.send(result))
    .catch(validationError(res))
}

module.exports = {
  index,
  create,
  destroy,
  contact,
}