
const Article = require("./article.model");

function validationError(res, statusCode) {
  const statusCodeLocal = statusCode || 422;
  return err => res.status(statusCodeLocal).json(err);
}

function handleError(res, statusCode) {
  const statusCodeLocal = statusCode || 500;
  return err => res.status(statusCodeLocal).send(err);
}


/**
 * Return all Article
 */
function index(req, res) {
  return Article.find({}).exec()
    .then(lists => res.status(200).json(lists))
    .catch(handleError(res));
}

/**
 * Creates a new Article
 */
function create(req, res) {
  const newList = new Article(req.body);
  return newList.save()
  .then((user) => {    
    res.json( user );
  })
  .catch(validationError(res));
}

module.exports = {
  index,
  create
}