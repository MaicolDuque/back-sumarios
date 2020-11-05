'use strict'

const rp = require('request-promise');
const cheerio = require('cheerio');
const Volume = require('./volume.model');
const User = require('../user/user.model');
const Article = require('../article/article.model')
const { commonWords } = require('../../config')


function handleError(res, statusCode) {
  const statusCodeLocal = statusCode || 500;
  return err => res.status(statusCodeLocal).send(err);
}

async function getArticlesByUrlHtml(req, res) {
  const urls = [
    "https://revistas.elpoli.edu.co/index.php/pol/article/view/1702/1415"
  ]
  const { url } = req.body
  // const sizas = await Promise.all(urls.map(async (url) => {
    const html = await rp(url);
    const $ = cheerio.load(html);
    const content = $("#body").text().replace(/([\,.;()])|\r?\t?/gi, '').trim().toUpperCase().replace(/\n/gi, ' ')
    const resumen = $('b > span').attr('lang', 'ES').text()
    // const arrayWords = content.split(' ');
    // const arrayWordsFilter = arrayWords.filter(word => !commonWords.includes(word)) // Eliminar palabras a no filtrar
    // const pattern = new RegExp('\\b' + keyword + '\\b', 'ig');
    // const quantity = (content.match(pattern) || []).length;
    // return { content }
  // }))

  res.send(resumen)
}

// Retrive url of articles by URL volume.
async function testScrapingHtml(url) {
  try {
    const html = await rp(url);
    const $ = cheerio.load(html);
    const articles = $('.tocArticle').map(function (i, el) {
      return {
        urlHtml: $('.tocGalleys a', el).attr('href'),
        title: $('.tocTitle a', el).text(),
        authors: $('.tocAuthors', el).text().trim().replace(/\t/g, '')
      }
    }).get();
    return articles
  } catch (error) {
    return Error(error);
  }
}



//  ----------------------------------------------------------------------------------------

// Retunr url volumes of magazine
async function getUrlsVolumes(url) {
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
  return urlVolumes;
}

// Update all volumes of magazine and add all articles to volume
async function addVolumesMagazine(req, res) {
  try {
    const { idEditor, urlMagazine } = req.body;
    const urlsVolumes = await getUrlsVolumes(urlMagazine);
    const currentUrlvolumes = await User.findOne({ _id: idEditor }, { mg_list_volumes: 1 }) // Retrieve current volumens of the magazine to only add new volumes
      .populate({ path: 'mg_list_volumes', model: 'Volume' }).exec()
    const onlyUrlVolumes = currentUrlvolumes.mg_list_volumes.map(volume => volume.url)
    const newVolumes = urlsVolumes.filter(volume => !onlyUrlVolumes.includes(volume.url))
    // return res.send(newVolumes)
    const response = await Promise.all(newVolumes.map((volume) => {
      const newVolume = new Volume(volume);
      newVolume.save()
        .then(async (vol) => {
          let idsArticles = await addArticlesByVolume(volume.url)
          Volume.updateOne({ _id: vol._id }, { $push: { list_articles: { $each: idsArticles } } }).exec()  // Add articles to volume
          return User.updateOne({ _id }, { $push: { mg_list_volumes: vol._id } }, { new: true }).exec()
        })
        .then(res => res)
        .catch(handleError(res));
    }))
    res.send(response)
  } catch (error) {
    res.send(error)
  }
}

//Add articles by volume and return identifiers to add info in the respective volume
async function addArticlesByVolume(urlVolume) {
  try {
    const listArticlesByVolume = await getArticlesByUrlVolume(urlVolume)
    const idsArticles = await Promise.all(listArticlesByVolume.map(article => {
      let newArticle = new Article(article);
      return newArticle.save()
        .then(data => data._id)
        .catch(handleError)
    }))
    return idsArticles
  } catch (error) {
    handleError(res)
  }
}

// Make indexacion html page with a specific keyword.
async function makeIndexacion(req, res) {
  try {
    const { idVolume } = req.body
    const urlArticles = await getArticlesByIdVolume(idVolume)
    // return res.send(urlArticles)
    const indexarArticles = await Promise.all(urlArticles.list_articles.map(async (article) => {
      const html = await rp(article.urlHtml);
      const $ = cheerio.load(html);
      const content = $("#body").text().replace(/([\,.;()$])|\r?\t?/gi, '').trim().toUpperCase().replace(/\n/gi, ' ')
      const arrayWords = content.split(' ');
      const arrayWordsFilter = arrayWords.filter(word => !commonWords.includes(word)) // Eliminar palabras a no filtrar
      const objectWords = calculateNumberTimesRepeat(arrayWordsFilter);
      Article.updateOne({ _id: article._id }, { list_keywords: objectWords }).exec().catch(console.log) // Add keywords to respective article
      return { ...objectWords }
    }))
    res.send(indexarArticles)
  } catch (error) {
    handleError(res)
  }
}

function calculateNumberTimesRepeat(arrayWords) {
  return arrayWords.reduce((acc, el) => {
    if (acc[el]) {
      acc[el]++
    } else {
      acc[el] = 1
    }
    return acc;
  }, {})
}

// Retrive url of articles by URL volume.
async function getArticlesByUrlVolume(url) {
  try {
    const html = await rp(url);
    const $ = cheerio.load(html);
    const articles = $('.tocArticle').map(function (i, el) {
      return {
        urlHtml: $('.tocGalleys a', el).attr('href'),
        title: $('.tocTitle a', el).text(),
        authors: $('.tocAuthors', el).text().trim().replace(/\t/g, '')
      }
    }).get();
    return articles
  } catch (error) {
    return Error(error);
  }
}

// Retrive url of articles by ID volume.
async function getArticlesByIdVolume(id) {
  try {
    // const { id } = req.body
    const articles = await Volume.findOne({ _id: id }, { list_articles: 1 })
      .populate({ path: 'list_articles', model: 'Article' }).exec()
    // return res.send(articles)
    return articles
  } catch (error) {
    return Error(error);
  }
}



module.exports = {
  getUrlsVolumes,
  getArticlesByUrlHtml,
  makeIndexacion,
  addVolumesMagazine,
  getArticlesByIdVolume
}