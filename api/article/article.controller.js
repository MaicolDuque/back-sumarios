
const Article = require("./article.model");
const Volume = require('../scraping/volume.model')

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
 * Return all Article by id Volume
 */
function articlesByIdVolume(req, res) {
  const { _id } = req.params
  return Volume.findOne({ _id }, { list_articles: 1 })
    .populate({ select: { list_keywords: 0 }, path: 'list_articles', model: 'Article' }).exec()
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


/**
 * Search articles with a specific keyword
 */
async function searchArticles(req, res) {
  try {
    let { keyword } = req.body
    keyword = keyword.toUpperCase()
    const articles = await Article.find({}).exec()
    console.log(articles.length)
    const ariclesWithKeyword = articles.filter( article => article.list_keywords[0] && article.list_keywords[0][keyword] ) //Select only the articles that have the keyword
    const infoArticlesOnlyKeyword = ariclesWithKeyword.map( article => {
      return {
        _id: article._id,
        urlHtml: article.urlHtml,
        title: article.title,
        authors: article.authors,
        list_keywords: { [keyword]: article.list_keywords[0][keyword] }
      }
    })
    const articlesSorted = infoArticlesOnlyKeyword.sort( ( a, b) => b.list_keywords[keyword] - a.list_keywords[keyword])  // Articles sorted DESC
    console.log(ariclesWithKeyword.length)
    res.send(articlesSorted)
  } catch (error) {
    return handleError(res)
  }
}
module.exports = {
  index,
  create,
  searchArticles,
  articlesByIdVolume
}