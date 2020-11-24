const { Router } = require('express');
const router = new Router();

const { hasRole, isAuth } = require('../../auth/auth.service')
const controller = require('./contact-list.controller');

router.get('/test', (req, res) => res.send('Test Contact list!'))
router.get('/', controller.index)
router.post('/', controller.create)
router.put('/:id', controller.update )
router.delete('/:id', controller.destroy)
router.get('/:_id', controller.showContactListsByUser)

module.exports = router