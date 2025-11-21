const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const menuController = require('../controllers/menu.controller');

router.get('/menu', guard.verifyAuth, menuController.getAll);
router.get('/menu/:id', guard.verifyAuth, menuController.getById);
router.post('/menu', guard.verifyAuth, menuController.create);
router.put('/menu/:id', guard.verifyAuth, menuController.update);

module.exports = router;
