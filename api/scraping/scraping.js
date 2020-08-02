'use strict'

const rp = require('request-promise');
const cheerio = require('cheerio');

function getAllUrls($){  
  const issues = $("#issues").html();    
  const urlArticles = $('div',issues).children('div').map((i,e)=> {
    if($(e).children('h4').html()){
      return {
        url: $(e).children('h4').children('a').attr('href')
      }
    }  
  }).get()
  console.log(urlArticles);
  return urlArticles;
}

async function scraping(req, res){
  const { url } = req.body;
  const html    = await rp(url);
  const $       = cheerio.load(html);
  const urls    = getAllUrls($);
  res.send(urls);
}

module.exports = {
  scraping
}