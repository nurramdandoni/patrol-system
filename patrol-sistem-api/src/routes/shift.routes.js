const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const shiftController = require('../controllers/shift.controller');

router.get('/shift', guard.verifyAuth, shiftController.getAll);
router.get('/shift/:id', guard.verifyAuth, shiftController.getById);
router.post('/shift', guard.verifyAuth, shiftController.create);
router.put('/shift/:id', guard.verifyAuth, shiftController.update);

module.exports = router;
