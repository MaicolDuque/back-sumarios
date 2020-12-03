const listArticles = require("./list-articles");

const filterArticles = (attr, value) => listArticles.filter(summary => summary[attr] === value)


async function index(req, res) {
  return Promise.resolve(res.send(listArticles))
}

function search(keyword) {
  const ariclesWithKeyword = listArticles.filter(article =>  article.list_keywords[0][keyword] )
  return infoArticlesOnlyKeyword = ariclesWithKeyword.map(article => {
    return {
      ...article,
      list_keywords: {
        [keyword]: keyword ? article.list_keywords[0][keyword] : 0
      }
    }
  })
}

async function searchArticles(req, res){
  return Promise.resolve(res.send(search('MÓVILES')))
}

module.exports = {
  index,
  filterArticles,
  searchArticles,
  search,
  listArticles
}