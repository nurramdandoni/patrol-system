const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const accessController = require('../controllers/access.controller');

router.get('/access', guard.verifyAuth, accessController.getAll);
router.get('/access/:id', guard.verifyAuth, accessController.getById);
router.post('/access', guard.verifyAuth, accessController.create);
router.put('/access/:id', guard.verifyAuth, accessController.update);

module.exports = router;
