const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

router.get('/user', guard.verifyAuth, userController.getAll);
router.get('/user/:id', guard.verifyAuth, userController.getById);
router.post('/user', guard.verifyAuth, userController.create);
router.put('/user/:id', guard.verifyAuth, userController.update);

module.exports = router;
