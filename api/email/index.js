const { Router } = require('express');
const router = new Router();

const controller = require('./mail.controller');
router.post('/', controller.sendEmail)
router.post('/send-email', controller.sendEmailSummary)

module.exports = router
