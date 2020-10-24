'use strict'

const rp = require('request-promise');
const cheerio = require('cheerio');

// async function getArticles(url) {
//   const html = await rp(url);
//   const $ = cheerio.load(html);
//   return "test tocArticle"
// }

async function scraping(req, res) {
  const { url } = req.body;
  const html = await rp(url);
  const $ = cheerio.load(html);
  console.log(req.body)
  const urls = getAllUrls($);
  const result = await Promise.all(urls.map(async (urlVolume) => {
    const { url } = urlVolume
    const articles = await getArticles(urlVolume)
    // console.log(articles)
    return {
      url,
      // test: "ssss"
      articles
    }
  }))

  res.send(result);
  //   const arr = [30, 10, 20, 20, 15, 20, 10];

  // // Bluebird promise
  // const respp = await Promise.map(arr, async (v) => {
  // 	console.log(`S ${v}`)
  // 	await sleep(v);
  // 	console.log(`F ${v}`);
  // 	return v + 1;
  // }, {concurrency: 2});
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
      title: $('.tocTitle a', el).text(),
      authors: $('.tocAuthors', el).text().trim().replace(/\t/g, '')
    }
  }).get();

  const result = await Promise.all(articles.map(async (article) => {
    const { urlHtml } = article
    const countKeyword = await searchKeyWord(urlHtml, 'control')
    return {
      urlHtml,
      countKeyword
    }
  }))
  // console.log(issues)
  // res.send(result);
  return result
}

async function searchKeyWord(url, keyword) {
  const html = await rp(url);
  const $ = cheerio.load(html);
  const content = $("#body").text();
  const pattern = new RegExp('\\b' + keyword + '\\b', 'ig');
  const quantity = (content.match(pattern) || []).length;
  return { keyword, quantity }
}



//  --------------------------------------------------

// Retunr url volumes of magazine
async function getUrlsVolumes(req, res) {
  const { url } = req.body;
  const html    = await rp(url);
  const $       = cheerio.load(html);
  const issues  = $("#issues").html();
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
  const filterResult = result.filter( article => article.countKeyword.count > 0)
  res.send(filterResult);
}


module.exports = {
  scraping,
  getUrlsVolumes,
  getArticlesByVolume
}