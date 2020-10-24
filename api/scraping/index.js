'use strict'

const scraping = require('./scraping');
const { Router } = require('express');

const router = new Router();

router.post("/", scraping.scraping);
router.post("/urls-volumes", scraping.getUrlsVolumes);
router.post("/articles-volume", scraping.getArticlesByVolume);

module.exports = router;