const { Router } = require('express');
const router = new Router();

const { hasRole } = require('../../auth/auth.service')
const controller = require('./contact-list.controller');

router.get('/test', (req, res) => res.send('Test Contact list!'))
router.get('/', hasRole('editor'), controller.index)
router.post('/', controller.create)

module.exports = router