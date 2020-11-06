const { Router } = require('express');
const router = new Router();

const { hasRole, isAuth } = require('../../auth/auth.service')
const controller = require('./contact-list.controller');

router.get('/test', (req, res) => res.send('Test Contact list!'))
router.get('/', controller.index)
router.get('/:_id', controller.showContactListsByUser)
router.post('/', isAuth(), controller.create)
router.delete('/:id', isAuth(), controller.destroy)

module.exports = router