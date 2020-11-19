const { Router } = require('express');
const router = new Router();

const { hasRole } = require('../../auth/auth.service')
const controller = require('./contact.controller');

router.get('/test', (req, res) => res.send('Test Contact list!'))
router.get('/', controller.index)
router.post('/', controller.create)
router.put('/:id', controller.update )
router.delete('/:contactid', controller.destroy)
router.get('/search/:_id', controller.contact)

module.exports = router