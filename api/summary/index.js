const { Router } = require('express');
const router = new Router();

const { hasRole } = require('../../auth/auth.service')
const controller = require('./summary.controller');

router.get('/test', (req, res) => res.send('Test Summaries list!'))
router.get('/', controller.index)
router.get('/:_id', controller.showSummaryId)
router.get('/user/:user_id', controller.showSummariesByUserId)
router.post('/', controller.create)
router.put('/:_id', controller.updatesArticlesByIdSummary)
router.put('/info/:_id', controller.updatesInfoSummaryById)

module.exports = router