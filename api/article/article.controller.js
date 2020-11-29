
const Article = require("./article.model");
const Volume = require('../scraping/volume.model')
const User = require('../user/user.model')

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
      res.json(user);
    })
    .catch(validationError(res));
}


/**
 * Search articles with a specific keyword
 */
async function searchArticles(req, res) {
  try {
    let { keyword, idUser } = req.body
    keyword = keyword.trim().toUpperCase()
    const allKeywords = keyword.split(",")
    const keyword1 = allKeywords[0].trim()
    const keyword2 = allKeywords[1] ? allKeywords[1].trim() : null
    const keyword3 = allKeywords[2] ? allKeywords[2].trim() : null
    // const articles = await Article.find({}).exec()
    const articlesEditor = await User.findOne( { _id: idUser }, { mg_list_volumes: 1 } )
                .populate({ select: { list_articles: 1, _id: 0 }, path: 'mg_list_volumes', model: 'Volume' })
                .populate({ path: 'list_articles', model: 'Article' }).exec()
    const articlesIds = articlesEditor.mg_list_volumes.map( volume => volume.list_articles ).flat() //Ids articles magazine editor
    const articles = await Article.find({ _id: { $in: articlesIds } }).exec()
    console.log(articles.length)
    const ariclesWithKeyword = articles.filter(article => { //Select only the articles that have the keyword
      return article.list_keywords[0][keyword1] || article.list_keywords[0][keyword2] || article.list_keywords[0][keyword3]
    })

    const infoArticlesOnlyKeyword = ariclesWithKeyword.map(article => {
      return {
        _id: article._id,
        urlHtml: article.urlHtml,
        title: article.title,
        authors: article.authors,
        list_keywords: {
          [keyword1]: keyword1 ? article.list_keywords[0][keyword1] : 0,
          [keyword2]: keyword2 ? article.list_keywords[0][keyword2] : 0,
          [keyword3]: keyword3 ? article.list_keywords[0][keyword3] : 0
        }
      }
    })

    const articlesSorted  =  orderArticlesDesc(infoArticlesOnlyKeyword, keyword1, keyword2, keyword3)
    res.send(articlesSorted)
  } catch (error) {
    return handleError(res)
  }
}

function orderArticlesDesc(infoArticlesOnlyKeyword, keyword1, keyword2, keyword3){
  let valorA1, valorA2, valorA3, valorB1, valorB2, valorB3, uno, dos = 0
  return infoArticlesOnlyKeyword.sort((a, b) => { // Articles sorted DESC
    valorA1 = a.list_keywords[keyword1] ? a.list_keywords[keyword1] : 0
    valorA2 = a.list_keywords[keyword2] ? a.list_keywords[keyword2] : 0
    valorA3 = a.list_keywords[keyword2] ? a.list_keywords[keyword3] : 0
    valorB1 = b.list_keywords[keyword1] ? b.list_keywords[keyword1] : 0
    valorB2 = b.list_keywords[keyword2] ? b.list_keywords[keyword2] : 0
    valorB3 = b.list_keywords[keyword2] ? b.list_keywords[keyword3] : 0
    uno = valorA1 + valorA2 + valorA3
    dos = valorB1 + valorB2 + valorB3
    return dos - uno
  })
}

module.exports = {
  index,
  create,
  searchArticles,
  articlesByIdVolume
}