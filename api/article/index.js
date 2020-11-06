const { Router } = require('express');
const router = new Router();

const { hasRole } = require('../../auth/auth.service')
const controller = require('./article.controller');

router.get('/test', (req, res) => res.send('Test Contact list!'))
router.get('/', controller.index)
router.post('/', controller.create)
router.post('/search', controller.searchArticles)

module.exports = router