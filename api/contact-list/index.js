const { Router } = require('express');
const router = new Router();

const controller = require('./contact-list.controller');

router.get('/test', (req, res) => res.send('Test Contact list!'))
router.get('/', controller.index)
router.post('/', controller.create)

module.exports = router