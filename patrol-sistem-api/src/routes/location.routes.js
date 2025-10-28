const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const locationController = require('../controllers/location.controller');

router.get('/location', guard.verifyAuth, locationController.getAll);
router.get('/location/:id', guard.verifyAuth, locationController.getById);
router.post('/location', guard.verifyAuth, locationController.create);
router.put('/location/:id', guard.verifyAuth, locationController.update);

module.exports = router;
