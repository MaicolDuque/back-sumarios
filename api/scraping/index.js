'use strict'

const { scraping } = require('./scraping');
const { Router } = require('express');

const router = new Router();

router.post("/", scraping);

module.exports = router;