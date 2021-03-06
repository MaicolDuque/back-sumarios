'use strict'

const scraping = require('./scraping');
const { Router } = require('express');

const router = new Router();

router.post("/test", scraping.getArticlesByUrlHtml);

router.post("/volumes-magazine", scraping.addVolumesMagazine);
router.post("/indexar", scraping.makeIndexacion);
router.post("/search-articles", scraping.getArticlesByIdVolume);

module.exports = router;