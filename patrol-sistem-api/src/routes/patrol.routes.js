const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const patrolController = require('../controllers/patrol.controller');

router.get('/list', guard.verifyAuth, patrolController.list);
router.post('/readQr', guard.verifyAuth, patrolController.readQr);
router.post('/check', guard.verifyAuth, patrolController.checking);

module.exports = router;
