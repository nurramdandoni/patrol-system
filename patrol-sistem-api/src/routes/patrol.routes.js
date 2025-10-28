const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const patrolController = require('../controllers/patrol.controller');

router.post('/generateQr', guard.verifyAuth, patrolController.generateQr);
router.post('/readQr', guard.verifyAuth, patrolController.readQr);
router.get('/list', guard.verifyAuth, patrolController.list);
router.post('/check', guard.verifyAuth, patrolController.checking);

module.exports = router;
