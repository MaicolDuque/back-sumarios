const { Router } = require('express');

// const User = require('../api/user/user.model');
const authGoogle = require('./google/passport');
const configPassportGoogle = require('./google');

// Passport Configuration
authGoogle.setup();

const router = new Router();

router.use('/google', configPassportGoogle);

module.exports = router;