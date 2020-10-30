'use strict'

const scraping = require('./scraping');
const { Router } = require('express');

const router = new Router();

router.post("/", scraping.scraping);
router.post("/articles-volume", scraping.getArticlesByVolume);
router.post("/test", scraping.getArticlesByUrlHtml);

router.post("/update-urls-volumes", scraping.getUrlsVolumes);
router.post("/indexar-html", scraping.makeIndexacion);

module.exports = router;