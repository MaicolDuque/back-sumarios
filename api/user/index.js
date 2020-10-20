const { Router } = require('express');
const { isAuth } = require('../../auth/auth.service');
const controller = require('./user.controller');
const router = new Router();

router.get('/test', (req, res) => res.send('Example Home page!'))
router.get('/', isAuth() , controller.index );
router.post('/', isAuth() , controller.create )
router.get('/:id', isAuth() , controller.show )
router.put('/:id', isAuth() , controller.update )
router.delete('/:id', isAuth() , controller.destroy )
router.get('/segura', isAuth() ,  (req, res) => res.send('Example segura!'))

module.exports = router;