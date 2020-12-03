const listSummaries = require("./list-summaries");

const filterSummaries = (attr, value) => listSummaries.filter( summary => summary[attr] === value )

const getSummariesKeywords = (user_id, keywords) =>  {
  return listSummaries.filter( sumary => sumary.user_id === user_id && sumary.list_keywords.some( k => keywords.includes(k)) )
}

async function index(req, res){
  return Promise.resolve(res.send(listSummaries))
}

async function showSummariesByUserId(req, res){
  const { user_id } = req.params
  return Promise.resolve(res.send(filterSummaries("user_id", user_id)))
}

async function summariesByKeywords(req, res) {
  const [ user_id, keywords ] = ["5f898f8b1f94ca3cf457f748", ["MÓVILES"]]
  return Promise.resolve(res.send(getSummariesKeywords(user_id, keywords)))
}

module.exports = {
  index,
  showSummariesByUserId,
  summariesByKeywords,
  filterSummaries,
  getSummariesKeywords,
  listSummaries
}