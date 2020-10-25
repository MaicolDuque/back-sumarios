'use strict'

const rp = require('request-promise');
const cheerio = require('cheerio');

async function scraping(req, res) {
  const { url } = req.body;
  const html = await rp(url);
  const $ = cheerio.load(html);
  console.log(req.body)
  const urls = getAllUrls($);
  const result = await Promise.all(urls.map(async (urlVolume) => {
    const { urlHtml } = urlVolume
    const articles = await getArticles(urlVolume)
    // console.log(articles)
    return {
      // url,
      // // test: "ssss"
      articles
      // urlHtml: articles.urlHtml
    }
  }))

  const onlyUrls = result.map(articles => {
    return articles.articles.map(article => article.urlHtml)
  })

  res.send(onlyUrls);
}

function getAllUrls($) {
  const issues = $("#issues").html();
  const urlArticles = $('div', issues).children('div').map((i, e) => {
    if ($(e).children('h4').html()) {
      return {
        url: $(e).children('h4').children('a').attr('href')
      }
    }
  }).get()
  console.log(urlArticles);
  return urlArticles;
}

async function getArticles(url) {
  // const { url } = req.body;
  const html = await rp(url);
  const $ = cheerio.load(html);
  const articles = $('.tocArticle').map(function (i, el) {
    return {
      urlHtml: $('.tocGalleys a', el).attr('href'),
      // title: $('.tocTitle a', el).text(),
      // authors: $('.tocAuthors', el).text().trim().replace(/\t/g, '')
    }
  }).get();

  // const result = await Promise.all(articles.map(async (article) => {
  //   const { urlHtml } = article
  //   const countKeyword = await searchKeyWord(urlHtml, 'control')
  //   return {
  //     urlHtml,
  //     countKeyword
  //   }
  // }))
  // console.log(issues)
  // res.send(result);
  return articles
}


//  ----------------------------------------------------------------------------------------

// Retunr url volumes of magazine
async function getUrlsVolumes(req, res) {
  const { url } = req.body;
  const html = await rp(url);
  const $ = cheerio.load(html);
  const issues = $("#issues").html();
  const urlVolumes = $('div', issues).children('div').map((i, e) => {
    if ($(e).children('h4').html()) {
      return {
        url: $(e).children('h4').children('a').attr('href'),
        description: $('.issueDescription', e).text()
      }
    }
  }).get()
  console.log(urlVolumes);
  res.send(urlVolumes)
}

// Return articles ans quantity occerences the specific word
async function getArticlesByVolume(req, res) {
  const { url, keyword } = req.body;
  const html = await rp(url);
  const $ = cheerio.load(html);
  const articles = $('.tocArticle').map(function (i, el) {
    return {
      urlHtml: $('.tocGalleys a', el).attr('href'),
      title: $('.tocTitle a', el).text(),
      authors: $('.tocAuthors', el).text().trim().replace(/\t/g, '')
    }
  }).get();

  const result = await Promise.all(articles.map(async (article) => {
    const { urlHtml, title, authors } = article
    const countKeyword = await searchKeyWord(urlHtml, keyword)
    return {
      urlHtml,
      title,
      authors,
      countKeyword
    }
  }))

  const filterResult = result.filter(article => article.countKeyword.quantity > 0)
  res.send(filterResult);
}

// Make scraping html page with a specific keyword.
async function searchKeyWord(url, keyword) {
  const html = await rp(url);
  const $ = cheerio.load(html);
  const content = $("#body").text().replace(/\t/g, '');
  const pattern = new RegExp('\\b' + keyword + '\\b', 'ig');
  const quantity = (content.match(pattern) || []).length;
  return { keyword, quantity }
}

async function getArticlesByUrlHtml(req, res) {
  const urls = [
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1546/1349",
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1552/1351",
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1554/1352",
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1588/1353",
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1611/1354",
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1620/1379",
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1637/1356",
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1506/1348",
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1651/1359",
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1550/1350"
  ]
  const { keyword } = req.body
  const sizas = await Promise.all(urls.map(async (url) => {
    const html = await rp(url);
    const $ = cheerio.load(html);
    const content = $("#body").text().replace(/\t/g, '');
    const pattern = new RegExp('\\b' + keyword + '\\b', 'ig');
    const quantity = (content.match(pattern) || []).length;
    return { keyword, quantity }
  }))

  res.send(sizas)
}


module.exports = {
  scraping,
  getUrlsVolumes,
  getArticlesByVolume,
  getArticlesByUrlHtml
}