const { Router } = require('express');
const { isAuth } = require('../../auth/auth.service');
const controller = require('./user.controller');
const router = new Router();

router.get('/test', (req, res) => res.status(200).json({ maicol: "Example Home page"}))
router.get('/',  controller.index);
router.get('/pending', controller.getUserPending)
router.post('/verify/', controller.verifyTrue)
router.post('/create', controller.create )
router.get('/:id', controller.show )
router.put('/:id' , controller.update )
router.put('/activate/:id', controller.updateStatus)
router.delete('/:id', controller.destroy )
router.get('/volumes/:id', controller.getVolumesByUserId )
router.get('/segura', isAuth() ,  (req, res) => res.send('Example segura!'))

module.exports = router;