const { Router } = require('express');
const { isAuth } = require('../../auth/auth.service');
const router = new Router();

// Example protected and unprotected routes
router.get('/', (req, res) => res.send('Example Home page!'))

router.get('/segura', isAuth ,  (req, res) => res.send('Example segura!'))

module.exports = router;