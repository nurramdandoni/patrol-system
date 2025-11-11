const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const roleController = require('../controllers/role.controller');

router.get('/role', guard.verifyAuth, roleController.getAll);
router.get('/role/:id', guard.verifyAuth, roleController.getById);
router.post('/role', guard.verifyAuth, roleController.create);
router.put('/role/:id', guard.verifyAuth, roleController.update);

module.exports = router;
