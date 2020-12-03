const contactList = require("./list-contact-list");

const filterArticles = (attr, value) => contactList.filter(summary => summary[attr] === value)


async function index(req, res) {
  return Promise.resolve(res.send(contactList))
}

async function create(req, res) {
  return Promise.resolve(res.status(200).json({
    error: false,
    msg: 'La lista de contactos se creó exitosamente.',
    result: "result"
  }))
}

module.exports = {
  index,
  filterArticles,
  create,
  contactList
}