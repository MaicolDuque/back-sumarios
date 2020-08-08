const { Router } = require('express');
const router = new Router();

// Example protected and unprotected routes
router.get('/', (req, res) => res.send('Example Home page!'))

module.exports = router;