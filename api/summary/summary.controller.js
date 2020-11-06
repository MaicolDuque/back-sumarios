
const Summary = require("./summary.model");

function validationError(res, statusCode) {
  const statusCodeLocal = statusCode || 422;
  return err => res.status(statusCodeLocal).json(err);
}

function handleError(res, statusCode) {
  const statusCodeLocal = statusCode || 500;
  return err => res.status(statusCodeLocal).send(err);
}


/**
 * Return all Summary
 */
function index(req, res) {
  return Summary.find({}).exec()
    .then(lists => res.status(200).json(lists))
    .catch(handleError(res));
}

/**
 * Return all Summary by User ID - Editor
 */
function showSummariesByUserId(req, res) {
  const { user_id } = req.params
  return Summary.find({ user_id }).exec()
    .then(data => res.status(200).json(data))
    .catch(handleError(res));
}

/**
 * Creates a new Summary
 */
function create(req, res) {
  const newSummary = new Summary(req.body);
  return newSummary.save()
    .then(data => res.status(201).json(data))
    .catch(validationError(res));
}

module.exports = {
  index,
  create,
  showSummariesByUserId
}